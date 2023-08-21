import { Note, Range } from "tonal";
import { Reverb, Soundfont } from "smplr";
import { writable, derived } from 'svelte/store';

// Reactive Svelte class https://www.youtube.com/watch?v=oQY98LZIW2E - lihautan

class PianoStore {
    constructor(minNote, maxNote) {
        this.minNote = minNote;
        this.maxNote = maxNote;
        this.keyboard = [];
        this.keyStateDict = {};
        this._baseKeyboard = []
        this.sustainPedal = false;
        this.softPedal = false;
        this.sostenutoPedal = false;
        this.instrument = 'acoustic_grand_piano';
        this.volume = 100;
        this.reverb = 0.2;
        this.velocity = 100;
        this.softMultiplier = .7;
        this.player;
        this.ac;
        this.lastPress = "";
        this.lastRelease = "";
        this._store = writable(this)
        // this.init() because of server side rendering, client AudioContexts aren't accessible unless first mounted.
    }
    init() {
        this.updateInstrument();
        // generate base copies to quickly reset on updates
        this._baseKeyboard = Note.sortedNames(Range.chromatic([Note.fromMidi(0), Note.fromMidi(127)]));
        this.updateKeyboard();
    }
    _normalize(note) {
        if (!Note.name(note)) note = Note.fromMidi(note);
        return Note.simplify(note);
    }
    updateKeyboard() {
        this.keyboard = this._baseKeyboard.slice(Note.midi(this.minNote), Note.midi(this.maxNote)+1);
        this.keyStateDict = this._baseKeyboard.reduce(
            (arr,curr) => (arr[curr]={}, arr), {});
        this._store.set(this);
    }
    updateInstrument() {
        if (this.ac) {this.player.stop();this.ac.close()};
        this.ac = new AudioContext;
        const soundfont = new Soundfont(this.ac, {
            instrument: this.instrument
        });
        soundfont.output.addEffect("reverb", new Reverb(this.ac), this.reverb);
        soundfont.output.setVolume(this.volume);
        soundfont.loaded().then(() => {
            if (this.player) this.player.stop()
            this.player = soundfont
            this._store.set(this)
        });
    }
    setVolume(value) {
        if (value > 127) {value = 127};
        this.volume = value;
        this.player.output.setVolume(value);
        this._store.set(this)
    }
    setVelocity(value) {
        if (value > 127) {value = 127};
        this.velocity = value;
        this._store.set(this)
    }
    setReverb(value) {
        if (value > 127) {value = 127};
        this.reverb = value;
        this.player.output.sendEffect("reverb", value);
        this._store.set(this)
    }
    // range clamp between A0 - G9 | midi: 21 - 127
    isRange(note) {
        return (Note.midi(note) >= 21 && Note.midi(note) <= 127)
    }
    //keys
    pressKey(note, velocity=this.velocity, dry=false) {
        note = this._normalize(note);

        if (Note.midi(note) <= Note.midi(this.minNote)) this.setMin(note);
        else if (Note.midi(note) >= Note.midi(this.maxNote)) this.setMax(note);
        
        this.keyStateDict[note].isPressed = true;
        this.lastPress = note;
        velocity = velocity*(this.softPedal ? this.softMultiplier : 1);
        if (!dry) this.player.start({ note: note, velocity: velocity });

        this._store.set(this);
    }
    releaseKey(note, dry=false) {
        note = this._normalize(note);

        this.keyStateDict[note].isPressed = false;
        this.lastRelease = note;
        if (!this.sustainPedal && !dry) {
            this.player.stop(note);
        }
        this._store.set(this);
    }
    scheduleKey(note, velocity=this.velocity, delay, duration) {
        note = this._normalize(note);
        velocity = velocity*(this.softPedal ? this.softMultiplier : 1);
        const time = this.ac.currentTime;

        // const osc = this.ac.createOscillator();
        // osc.start(time+delay);
        // osc.stop(time+delay);
        // osc.onended = () => {
        //     console.log("Test");
        // };

        const timeoutId = setTimeout(() => {
            this.pressKey(note, undefined, true);
        }, delay*1000);
        this.player.start({ note: note, velocity: velocity, time: time+delay, duration: duration, onEnded: () => {
            this.releaseKey(note, true);
            clearTimeout(timeoutId)
        } });
    }
    getIsPressed(note) {
        if (this.keyStateDict[note]) return this.keyStateDict[note].isPressed;
        return false;
    }
    setSustainPedal(active=!this.sustainPedal) {
        if (active) {
            this.sustainPedal = true;
        } else {
            this.sustainPedal = false;
            this.player.stop();
        }
        this._store.set(this);
    }
    setSoftPedal(active=!this.softPedal) {
        if (active) {
            this.softPedal = true;
        } else {
            this.softPedal = false;
        }
        this._store.set(this);
    }
    setSostenutoPedal(active=!this.sostenutoPedal) {
        if (active) {
            this.sostenutoPedal = true;
        } else {
            this.sostenutoPedal = false;
        }
        this._store.set(this);
    }
    releaseAll() {
        this.player.stop();
        this.updateKeyboard();
    }
    //instrument
    setInstrument(instrument) {
        this.instrument = instrument;
        this.updateInstrument();
    }
    stepRange(interval, enforceWhite=false) {
        let newMax = Note.simplify(Note.transpose(this.maxNote, interval));
        interval = interval.includes('-') ? interval.substr(1) : '-'+interval;
        let newMin = Note.simplify(Note.transpose(this.minNote, interval));
        if (enforceWhite) newMax = newMax.charAt(0) + newMax.slice(-1);
        if (enforceWhite) newMin = newMin.charAt(0) + newMin.slice(-1);
        if (Note.midi(newMax) < Note.midi(newMin)) return;
        this.maxNote = this.isRange(newMax) ? newMax : Note.fromMidi(127);
        this.minNote= this.isRange(newMin) ? newMin : Note.fromMidi(21);
        this.updateKeyboard();
    }
    setMin(note) {
        note = this._normalize(note);
        if (this.isRange(note) && (Note.midi(note) <= Note.midi(this.maxNote))) {
            this.minNote = Note.simplify(note);
        }
        this.updateKeyboard();
        return this.minNote;
    }
    setMax(note) {
        note = this._normalize(note);
        if (this.isRange(note) && (Note.midi(note) >= Note.midi(this.minNote))) {
            this.maxNote = Note.simplify(note);
        }
        this.updateKeyboard();
        return this.maxNote;
    }

    // Anything with a subscribe function is a store
    subscribe(subscriber) {
		return this._store.subscribe(subscriber)
	}
  }

  const piano = new PianoStore('F2', 'G6');

  export const keyboard = derived(piano, ($piano) => $piano.keyboard); // only react to keyboard changes

  export default piano;