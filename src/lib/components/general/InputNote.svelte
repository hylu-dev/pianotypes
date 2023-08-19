<script>
import { createEventDispatcher } from 'svelte';
import { Note } from 'tonal';

export let id = '';
export let inputNote = 'C4';

const dispatch = createEventDispatcher();

let valueAtClick = inputNote;
let startMousePos = 0;
let isDragging = false;

function trackValue(e) {
    if (isDragging) {
        const dist = Math.ceil(startMousePos-e.clientY);
        const sign = Math.sign(dist);
        startMousePos = e.clientY;
        let newNote;
        if (sign === 1){
            newNote = Note.simplify(Note.transpose(inputNote, "2m"));
        } else {
            newNote = Note.simplify(Note.transpose(inputNote, "-2m"));
        }
        if (inRange(newNote)) {
            inputNote = newNote;
            dispatch('change', Note.simplify(inputNote));
        }
    }
}

function handleMouseDown(e) {
    startMousePos = e.clientY;
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

</script>

<svelte:window on:mousemove={trackValue} on:mouseup={handleMouseUp}/>
<input
id={id}
draggable="true"
on:change={handleChange}
on:mousedown={handleMouseDown}
bind:value={inputNote}
maxlength={4}
type="text">

<style>
    input {
        cursor: n-resize;
        width: var(--width, 4ch);
        height: var(--height, 2ch);
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>