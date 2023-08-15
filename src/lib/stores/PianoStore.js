import { Note, Range } from "tonal";
import { Reverb, Soundfont, SplendidGrandPiano } from "smplr";
import { writable } from 'svelte/store';

// Reactive Svelte class https://www.youtube.com/watch?v=oQY98LZIW2E - lihautan

class PianoStore {
    constructor(minNote, maxNote) {
        this.minNote = minNote;
        this.maxNote = maxNote;
        this.keyboard = [];
        this.keyStateDict = {};
        this.sustainPedal = false;
        this.softPedal = false;
        this.sostenutoPedal = false;
        this.instrument = 'acoustic_grand_piano';
        this.volume = 127;
        this.reverb = 0.2;
        this.softMultiplier = .6;
        this.player;
        this.ac;
        this.lastPress = "";
        this.lastRelease = "";
        this._store = writable(this)
        // this.init() because of server side rendering, client AudioContexts aren't accessible unless first mounted.
    }
    init() {
        this.ac = new AudioContext()
        this.updateInstrument();
        this.updateKeyboard();
    }
    updateKeyboard() {
        this.player.stop()
        this.keyboard = Note.sortedNames(Range.chromatic([this.minNote, this.maxNote]));
        this.keyStateDict = this.keyboard.reduce((arr,curr) => (arr[curr]={}, arr[Note.enharmonic(curr)]={}, arr), {});
        this._store.set(this);
    }
    updateInstrument() {
        this.player =  new Soundfont(this.ac, {
            instrument: this.instrument
        });
        this.updateEffects();
        this._store.set(this);
        return this.instrument
    }
    updateEffects() {
        this.player.output.addEffect("reverb", new Reverb(this.ac), this.reverb);
        this.player.output.setVolume(this.volume);
    }
    //keys
    pressKey(note, velocity=80) {
        if (!(this.keyStateDict[note] || this.keyStateDict[Note.enharmonic(note)])) { return; } // Check note is part of piano range
        this.keyStateDict[note].isPressed = this.keyStateDict[Note.enharmonic(note)].isPressed = true;
        velocity = parseInt(velocity*(this.softPedal ? this.softMultiplier : 1));
        this.player.start({ note: note, velocity: velocity });
        this.lastPress = note;
        this._store.set(this);
    }
    releaseKey(note) {
        if (!(this.keyStateDict[note] || this.keyStateDict[Note.enharmonic(note)])) { return; } // Check note is part of piano range
        this.keyStateDict[note].isPressed = this.keyStateDict[Note.enharmonic(note)].isPressed = false;

        if (!this.sustainPedal) {
            this.player.stop(note);
        }
        this.player.stop(Note.midi(note))
        this.lastRelease = note;
        this._store.set(this);
    }
    getIsPressed(note) {
        if (this.keyStateDict[note]) return this.keyStateDict[note].isPressed;
        return false;
    }
    setSustainPedal(active) {
        if (active) {
            this.sustainPedal = true;
        } else {
            this.sustainPedal = false;
            this.player.stop();
        }
        this._store.set(this);
    }
    setSoftPedal(active) {
        if (active) {
            this.softPedal = true;
        } else {
            this.softPedal = false;
        }
        this._store.set(this);
    }
    setSostenutoPedal(active) {
        if (active) {
            this.sostenutoPedal = true;
        } else {
            this.sostenutoPedal = false;
        }
        this._store.set(this);
    }
    //instrument
    setInstrument(instrument) {
        this.instrument = instrument;
        this.updateInstrument();
    }
    //range clamp between A0 - G#9 | midi: 21 - 127
    setMin(note) {
        if (Note.name(note) && Note.midi(note) >= 21 && Note.midi(note) < 128) {
            this.minNote = Note.simplify(note);
            this.updateKeyboard();
        }
        return this.minNote;
    }
    setMax(note) {
        if (Note.name(note) && Note.midi(note) >= 21 && Note.midi(note) < 128) {
            this.maxNote = Note.simplify(note);
            this.updateKeyboard();
        }
        return this.maxNote;
    }

    // Anything with a subscribe function is a store
    subscribe(subscriber) {
		return this._store.subscribe(subscriber)
	}
  }

  const piano = new PianoStore('C3', 'C6');
  export default piano;