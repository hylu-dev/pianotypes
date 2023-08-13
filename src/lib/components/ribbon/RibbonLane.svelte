<script>
import RibbonBlock from './RibbonBlock.svelte'
import piano from '$lib/stores/PianoStore'
import { derived } from 'svelte/store';
import { Note } from "tonal"

export let note = '';

let ribbons = new Set()
let ids = 0
let isWhiteKey = Note.accidentals(note) ? false : true;
let isOffset = Note.accidentals(Note.transpose(note, "2m")) ? true : false; 
const isPressed = derived(piano, ($piano) => $piano.getIsPressed(note)); // only react to keypresses for this note

function destroyRibbon(id) {
    ribbons.delete(id);
}

function incrementIds() {
    // bandaid fix - ids are incremented on any piano key press, this helps determine which key is pressed
    ribbons.add(ids);
    ids++;
}

$: if ($isPressed) incrementIds();
</script>

<!-- each ribbon block is tracked with an increasing id for removal -->
<div class="ribbon-lane"
    class:offset-key={isOffset}
    class:white-key={isWhiteKey}
    class:black-key={!isWhiteKey}>
    {#each Array.from(ribbons) as id (`${note}${id}`)}
        <RibbonBlock
        ribbonID={id}
        isWhiteKey={isWhiteKey}
        released={!$piano.getIsPressed(note)}
        on:destroy={destroyRibbon}
        ></RibbonBlock>
    {/each}
    <div class:glow={$piano.getIsPressed(note)}></div>
</div>

<style>
    .ribbon-lane {
        position: relative;
        display: flex;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
    }

    .glow {
        height: 0;
        align-self: flex-end;
        box-shadow: 0 0 25px 15px goldenrod;
        z-index: 2;
    }

    .offset-key {
        margin-right: calc(var(--black-key-width)/-2);
    }

    .white-key {
        width: var(--white-key-width);
        border-left: var(--white-key-border-width) solid transparent;
        border-right: var(--white-key-border-width) solid transparent;
        z-index: 0
    }

    .black-key {
        width: var(--black-key-width);
        z-index: 1
    }

</style>