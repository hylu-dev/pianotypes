<script>
    import PianoKey from './PianoKey.svelte'   
    import piano from '$lib/stores/PianoStore'
    import hotkey from '$lib/stores/HotkeyStore'
    import { onMount } from 'svelte';

    // Done onMount, otherwise AudioContext cannot be retrieved in Svelte
    onMount(() => {
        $piano.init();
    });

    // Keyboard input handlers
    function pressKey(e) {
        // override quickfind on firefox
        if ("'/".includes(e.key)) {
            e.preventDefault();
        }
        if (e.repeat) { return }
        let note = $hotkey.getKeyNoteBinding(e.key);
        let velocity = 80;
        //$hotkey.isLeftHand(e.key) ? velocity = 60 : null; // left hand quieter
        if (note) { $piano.pressKey(note, velocity); } 
    }
    function releaseKey(e) {
        if (e.repeat) { return }
        let note = $hotkey.getKeyNoteBinding(e.key);
        if (note) { $piano.releaseKey(note); }
    }

    // Seperate handlers for mouse click event
    function clickPressKey(e) {
        $piano.pressKey(e.detail); 
    }
    function clickReleaseKey(e) {
        $piano.releaseKey(e.detail);
    }

    function clearKeyStates() {
        $piano.updateKeyboard()
    }
</script>

<svelte:window on:keydown={pressKey} on:keyup={releaseKey} on:blur={clearKeyStates}/>
<div ref="keyboard" id="piano-keyboard">
    <div class="key-container">

        {#each $piano.keyboard as note}
            <PianoKey note={note} on:keyPress={clickPressKey} on:keyRelease={clickReleaseKey}></PianoKey>
        {/each}
    </div>
</div>

<style>
    #piano-keyboard {
        display: flex;
        justify-items: center;
        align-items: center;
        grid-area: piano;
        box-sizing: border-box;
        background: var(--tertiary-bg-colour);
    }

    .key-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-flow: row nowrap;
    }
</style>