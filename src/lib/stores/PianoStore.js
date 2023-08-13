import { Note, Range } from "tonal";
import { Reverb, Soundfont, SplendidGrandPiano } from "smplr";
import { writable } from 'svelte/store';

// Reactive Svelte class https://www.youtube.com/watch?v=oQY98LZIW2E - lihautan

class PianoStore {
    constructor(minNote, maxNote) {
        this.minNote = minNote;
        this.maxNote = maxNote;
        this.keyboard = [];
        this.keyboardDict = {};
        this.sustainPedal = false;
        this.instrument = 'acoustic_grand_piano';
        this.volume = 127;
        this.reverb = 0.2;
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
        this.updateEffects();
        this.updateKeyboard();
    }
    updateKeyboard() {
        this.player.stop()
        this.keyboard = Note.sortedNames(Range.chromatic([this.minNote, this.maxNote]));
        this.keyboardDict = this.keyboard.reduce((arr,curr) => (arr[curr]={}, arr[Note.enharmonic(curr)]={}, arr), {})
        this._store.set(this)
    }
    updateInstrument() {
        this.player =  new Soundfont(this.ac, {
            instrument: this.instrument
        });
        this._store.set(this)
    }
    updateEffects() {
        this.player.output.addEffect("reverb", new Reverb(this.ac), this.reverb);
        this.player.output.setVolume(this.volume);
    }
    //keys
    pressKey(note, velocity=80) {
        if (!(this.keyboardDict[note] || this.keyboardDict[Note.enharmonic(note)])) { return; } // Check note is part of piano range
        this.keyboardDict[note].isPressed = this.keyboardDict[Note.enharmonic(note)].isPressed = true;
        this.player.start({ note: note, velocity: velocity });
        this.lastPress = note;
        this._store.set(this)
    }
    releaseKey(note) {
        if (!(this.keyboardDict[note] || this.keyboardDict[Note.enharmonic(note)])) { return; } // Check note is part of piano range
        this.keyboardDict[note].isPressed = this.keyboardDict[Note.enharmonic(note)].isPressed = false;

        if (!this.sustainPedal) {
            this.player.stop(note);
        }
        this.player.stop(Note.midi(note))
        this.lastRelease = note;
        this._store.set(this)
    }
    getIsPressed(note) {
        if (this.keyboardDict[note]) return this.keyboardDict[note].isPressed;
        return false;
    }
    pressSustainPedal() {
        this.sustainPedal = true;
        this._store.set(this)
    }
    liftSustainPedal() {
        this.sustainPedal = false;
        for (let note in this.gainNodes) {
            if (this.keyboardDict[note].isPressed == false) {
                this.gainNodes[note].stop();
                delete this.gainNodes[note];
            }
        }
        this._store.set(this)
    }
    //instrument
    setInstrument(instrument) {
        this.instrument = instrument;
        this.updateInstrument();
    }
    //range
    setMin(note) {
        if (Note.octave(note) >= 0 && Note.octave(note) < 9) {
            this.minNote = Note.simplify(note);
            this.updateKeyboard();
        }
    }
    setMax(note) {
        if (Note.octave(note) >= 0 && Note.octave(note) < 9) {
            this.maxNote = Note.simplify(note);
            this.updateKeyboard();
        }
    }

    // Anything with a subscribe function is a store
    subscribe(subscriber) {
		return this._store.subscribe(subscriber)
	}
  }

  const piano = new PianoStore('F2', 'C6');
  export default piano;