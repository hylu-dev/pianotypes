import { Note, Midi, Range } from "tonal";
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
        // generate base copies to quickly reset on updates
        this._baseKeyboard = Note.sortedNames(Range.chromatic([Midi.midiToNoteName(0), Midi.midiToNoteName(127)]));
        this.updateKeyboard();
    }
    updateKeyboard() {
        this.keyboard = this._baseKeyboard.slice(Note.midi(this.minNote), Note.midi(this.maxNote)+1);
        this.keyStateDict = this._baseKeyboard.reduce((arr,curr) => (arr[curr]={}, arr[Note.enharmonic(curr)]={isPressed: false}, arr), {});
        this._store.set(this);
    }
    updateInstrument() {
        // WARNING: Currently smplr starts to lag after switching instruments multiple times and creating multiple new Soundfont. Memory leak?
        const soundfont = new Soundfont(this.ac, {
            instrument: this.instrument
        });
        soundfont.output.addEffect("reverb", new Reverb(this.ac), this.reverb);
        soundfont.output.setVolume(this.volume);
        soundfont.loaded().then(() => {
            this.player = soundfont
            this._store.set(this)
        });
    }
    //keys
    pressKey(note, velocity=80) {
        if (Note.midi(note) < Note.midi(this.minNote) || Note.midi(note) >= Note.midi(this.maxNote)) { return; } // Check note is part of piano range
        this.keyStateDict[note].isPressed = this.keyStateDict[Note.enharmonic(note)].isPressed = true;
        velocity = parseInt(velocity*(this.softPedal ? this.softMultiplier : 1));
        this.player.start({ note: note, velocity: velocity });
        this.lastPress = note;
        this._store.set(this);
    }
    releaseKey(note) {
        if (Note.midi(note) < Note.midi(this.minNote) || Note.midi(note) >= Note.midi(this.maxNote)) { return; } // Check note is part of piano range
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
    releaseAll() {
        this.player.stop();
        this.updateKeyboard();
    }
    //instrument
    setInstrument(instrument) {
        this.instrument = instrument;
        this.updateInstrument();
    }
    //range clamp between A0 - G#9 | midi: 21 - 127
    setMin(note) {
        if (Note.name(note) && Note.midi(note) >= 21 && Note.midi(note) < Note.midi(this.maxNote)) {
            this.minNote = Note.simplify(note);
            this.updateKeyboard();
        }
        return this.minNote;
    }
    setMax(note) {
        if (Note.name(note) && Note.midi(note) > Note.midi(this.minNote) && Note.midi(note) < 128) {
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

  const piano = new PianoStore('F2', 'G6');

  export const keyboard = derived(piano, ($piano) => $piano.keyboard); // only react to keyboard changes

  export default piano;