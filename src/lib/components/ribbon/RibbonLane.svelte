<script>
import RibbonBlock from './RibbonBlock.svelte'
import piano from '$lib/stores/PianoStore'
import { derived } from 'svelte/store';
import { Note } from "tonal"

export let note = '';

let ribbons = new Set()
let ids = 0
let isWhiteKey = Note.accidentals(note) ? false : true;
const isPressed = derived(piano, ($piano) => $piano.getIsPressed(note)); // only react to keypresses for this note

function destroyRibbon(id) {
    ribbons.delete(id);
}

function incrementIds() {
    ribbons.add(ids);
    ids++;
}

// ids are incremented on any piano key press
$: if ($isPressed) incrementIds();
</script>

<!-- Outer div serves as either an ineffectual wrapper for white keys or relative positioning point for black keys without affecting white key spacing -->
<div class='key-wrapper' class:black-proxy={isWhiteKey}>
    <div class="ribbon-lane" class:white-key={isWhiteKey} class:black-key={!isWhiteKey}>
        <!-- each ribbon block is tracked with an increasing id for removal -->
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
</div>

<style>
    .key-wrapper {
        display: flex;
        min-width: 0;
    }

    .ribbon-lane {
        position: relative;
        display: flex;
        justify-content: center;
        height: 100%;
    }

    .glow {
        height: 0;
        align-self: flex-end;
        box-shadow: 0 0 25px 15px goldenrod;
        z-index: 2;
    }

    .white-key {
        width: var(--white-key-width);
        border-left: var(--white-key-border-width) solid transparent;
        border-right: var(--white-key-border-width) solid transparent;
        z-index: 0
    }

     /* Use as a relative positioning point for child black key without affecting white key spacing */
    .black-proxy {
        position: relative;
    }

    .black-key {
        position: absolute;
        width: var(--black-key-width);
        left: calc(var(--black-key-width)/-2);
        z-index: 1
    }

</style>