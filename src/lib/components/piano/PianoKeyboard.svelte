<script>
import PianoKey from './PianoKey.svelte'   
import piano, { keyboard } from '$lib/stores/PianoStore'
import hotkey from '$lib/stores/HotkeyStore'
import { onMount } from 'svelte';

// Done onMount, otherwise AudioContext cannot be retrieved in Svelte
onMount(() => {
    $piano.init();
});

// Keyboard input handlers
function pressKey(e) {
    if (e.repeat || !$piano.player) return;
    let note = $hotkey.getKeyNoteBinding(e.key);
    if (note) $piano.pressKey(note);
}
function releaseKey(e) {
    if (e.repeat || !$piano.player) return;
    let note = $hotkey.getKeyNoteBinding(e.key);
    if (note) $piano.releaseKey(note);
}

// Seperate handlers for mouse click event
function clickPressKey(e) {
    $piano.ac.resume();
    $piano.pressKey(e.detail); 
}
function clickReleaseKey(e) {
    $piano.releaseKey(e.detail);
}
</script>

<svelte:window on:keydown={pressKey} on:keyup={releaseKey}/>
<div ref="keyboard" id="piano-keyboard">
    <div class="key-container">
        {#each $keyboard as note (note)}
            <PianoKey note={note} on:keyPress={clickPressKey} on:keyRelease={clickReleaseKey}></PianoKey>
        {/each}
    </div>
</div>

<style>
    #piano-keyboard {
        display: flex;
        max-width: 100vw;
        justify-content: center;
        align-items: center;
        grid-area: piano;
        background: var(--bg-dark-grey);
    }

    .key-container {
        height: 100%;
        max-width: 100%;
        display: flex;
        flex-flow: row nowrap;
    }
</style>