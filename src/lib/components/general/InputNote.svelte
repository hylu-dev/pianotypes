<script>
import { Note, Interval } from 'tonal';
import { inputFocused } from '$lib/stores/GlobalStore'
import { createEventDispatcher } from 'svelte';

export let id;
export let inputNote = 'C4';

const dispatch = createEventDispatcher();

let valueAtClick = inputNote;
let startMousePos = [0, 0];
let isDragging = false;

function trackValue(e) {
    if (isDragging) {
        const distY = startMousePos[1]-e.clientY;
        const distX = e.clientX - startMousePos[0];
        let dist = (distX+distY);
        dist = ~~(dist/4);
        
        let newNote;
        let interval = Interval.fromSemitones(dist)
        newNote = Note.simplify(Note.transpose(valueAtClick, interval));

        if (inRange(newNote)) {
            inputNote = newNote;
            dispatch('change', Note.simplify(inputNote));
        }
    }
}

function handleMouseDown(e) {
    e.target.select();
    startMousePos = [e.clientX, e.clientY];
    isDragging = true;
    valueAtClick = inputNote;
}

function handleMouseUp(e) {
    isDragging = false;
}

function handleChange(e) {
    let value = e.target.value;
    if (inRange(inputNote)) dispatch('change', value);
}

function inRange(note) {
    return (Note.midi(note) >= 21 && Note.midi(note) <= 127)
}

function keyBlur(e) {
    if (e.key === "Enter") {
        e.target.blur();
    }
}

</script>

<svelte:window on:mousemove={trackValue} on:mouseup={handleMouseUp}/>
<input
id={id}
draggable="true"
on:change={handleChange}
on:mousedown={handleMouseDown}
on:focusin={() => inputFocused.set(true)}
on:focusout={() => inputFocused.set(false)}
on:keypress={keyBlur}
bind:value={inputNote}
maxlength={4}
type="text">

<style>
    input {
        cursor: n-resize;
        width: var(--width, 3ch);
        height: var(--height, 2ch);
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>