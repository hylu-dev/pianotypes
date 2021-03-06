import { Note, Scale } from "@tonaljs/tonal";

export default class KeyBindingStore {
    constructor(base) {
        this.bindings = {};
        // normal mode bindings
        this.r1 = ['z','x','c','v','b','n','m',',','.','/'];
        this.r2 = ['a','s','d','f','g','h','j','k','l',';',"'"];
        this.r3 = ['q','w','e','r','t','y','u','i','o','p','[',']'];
        this.r4 = ['1','2','3','4','5','6','7','8','9','0','-','='];
        // split mode bindings
        this.lr1 = this.r1.slice(0, this.r1.length/2);
        this.lr2 = this.r2.slice(0, this.r2.length/2);
        this.lr3 = this.r3.slice(0, this.r3.length/2);
        this.lr4 = this.r4.slice(0, this.r4.length/2);
        this.rr1 = this.r1.slice(this.r1.length/2, this.r1.length);
        this.rr2 = this.r2.slice(this.r2.length/2, this.r2.length);
        this.rr3 = this.r3.slice(this.r3.length/2, this.r3.length);
        this.rr4 = this.r4.slice(this.r4.length/2, this.r4.length);
        this.mode = 1; // 0 for no bindings | 1 for normal mode | 2 for split mode
        this.maxNote = "C9";
        this.base = base;
        this.splitOffset = 6; // for split mode
        this.createBindings();
    }
    /**
     * 
     * @param {Array} whiteKeys Array of keys to bind to white keys
     * @param {Array} blackKeys Array of keys to bind to black keys
     * @param {Array} scale The scale we want to bind notes to, typically chromatically
     * @param {Number} index The index of the chromaic scale to start binding from
     * @returns {Number} The index of the note last binded, can be reused to bind remaining scale
     */
    __bindToScale(whiteKeys, blackKeys, scale, index) {
        let cScale = Scale.rangeOf('C major')(this.base, this.maxNote);
        let isWhite = (note) => cScale.includes(note) || cScale.includes(Note.enharmonic(note));
        let indexWhite = 0; // white keys
        let indexBlack = 0; // black keys
        if (isWhite(scale[index])) { indexBlack++; } // shift blacks keys 1 if starting on white
        while (indexWhite<whiteKeys.length && index < scale.length) {
            let note = scale[index++];
            isWhite(note) ? this.bindings[whiteKeys[indexWhite++]] = note : this.bindings[blackKeys[indexBlack++]] = note
            if (isWhite(note) == isWhite(Note.transpose(note,'m2'))) {
                indexBlack++;
            }
        }
        if (!isWhite(scale[index]) && blackKeys.length > whiteKeys.length && index < scale.length) {  //bind leftover black key if available
            this.bindings[blackKeys[indexBlack++]] = scale[index]; // don't increment index to allow this key to be doubly bound
        }
        return index
    }
    createBindings() {
        this.bindings = {}
        let chromatic = Scale.rangeOf('C chromatic')(this.base, this.maxNote);
        if (this.mode == 1) {
            let index = this.__bindToScale(this.r1, this.r2, chromatic, 0);
            this.__bindToScale(this.r3, this.r4, chromatic, index);
        } else if (this.mode == 2) {
            let index = this.__bindToScale(this.lr1, this.lr2, chromatic, 0);
            index = this.__bindToScale(this.lr3, this.lr4, chromatic, index);
            index+=this.splitOffset;
            index =this.__bindToScale(this.rr1, this.rr2, chromatic, index);
            this.__bindToScale(this.rr3, this.rr4, chromatic, index);
        }
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        this.createBindings();
    }
    getBase() {
        return this.base;
    }
    setBase(note) {
        let n = Note.simplify(note)
        if (Note.octave(n) >= 0) {
            this.base = Note.simplify(n);
            this.createBindings();
        }
    }
    getKeyNoteBinding(key) {
        if (this.bindings[key]) {
            return this.bindings[key];
        } else if (this.bindings[key.toLowerCase()]) {
            return this.bindings[key.toLowerCase()];
        }
    }
    getNoteKeyBinding(note) {
        let keybindings = "";
        if (note) {
            for (const [key, value] of Object.entries(this.bindings)) {
                if (Note.midi(note) == Note.midi(value)) {
                    keybindings += key;
                }
            }
        }
        return keybindings;
    }
    updateBinding(key, note) {
        this.bindings[key] = note;
    }
    isLeftHand(binding) {
        if (this.mode == 1) {
            return [...this.r1, ...this.r2].includes(binding);
        } else if (this.mode == 2) {
            return [...this.lr1, ...this.lr2, ...this.lr3, ...this.lr4].includes(binding);
        }
        return false;
    }
}