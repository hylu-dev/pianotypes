<script>
    import piano from '$lib/stores/PianoStore'
    import hotkey from '$lib/stores/HotkeyStore'
    import { Note } from "tonal"
    import { createEventDispatcher } from 'svelte';

    export let note = '';

    const dispatch = createEventDispatcher();

    let isHover = false;
    let showHotkeys = true;
    let isWhiteKey = Note.accidentals(note) ? false : true;
    let isOffset = Note.accidentals(Note.transpose(note, "2m")) ? true : false; // offset margin if key precedes a black key

    function dispatchKeyPress(e) {
        if (e.buttons > 0) dispatch('keyPress', note);
    }

    function dispatchKeyRelease(e) {
        if (e.type == "mouseup" || e.buttons > 0) dispatch('keyRelease', note);
    }
</script>

<div class="piano-key"
    class:offset-key={isOffset}
    class:white-key={isWhiteKey}
    class:white-key--hover={isWhiteKey&&isHover}
    class:white-key--pressed={isWhiteKey&&$piano.getIsPressed(note)}
    class:black-key={!isWhiteKey}
    class:black-key--hover={!isWhiteKey&&isHover}
    class:black-key--pressed={!isWhiteKey&&$piano.getIsPressed(note)}
    on:mouseover={() => isHover=true}
    on:focus={() => isHover=true}
    on:mouseout={() =>isHover=false}
    on:blur={() => isHover=false}
    on:mouseenter={dispatchKeyPress}
    on:mousedown={dispatchKeyPress}
    on:mouseup={dispatchKeyRelease}
    on:mouseleave={dispatchKeyRelease}
    role="none">
    {#if showHotkeys }
        <h1>{ $hotkey.getNoteKeyBinding(note) }</h1>
    {/if}
</div>

<style>
    .piano-key {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .offset-key {
        margin-right: calc(var(--black-key-width)/-2);
    }

    .white-key {
        width: var(--white-key-width);
        border-left: var(--white-key-border-width) solid transparent;
        border-right: var(--white-key-border-width) solid transparent;
        background: var(--white-key-colour);
        background-clip: padding-box;
        z-index: 2;
    }

    .white-key h1 {
        color: rgba(0, 0, 0, 0.3);
        align-self: flex-end;
        user-select: none;
        font-size: var(--key-label-size);
        font-family: var(--key-label-font-family);
        font-weight: var(--key-label-font-weight);
    }

    .white-key--hover {
        background: var(--white-key-hover-colour);
        background-clip: padding-box;
        padding-bottom: .5ch;
    }

    .white-key--pressed {
        background: var(--white-key-active-colour);
        background-clip: padding-box;
        padding-bottom: .5ch;
    }

    .black-key {
        background: var(--black-key-colour);
        min-width: var(--black-key-width);
        height: 50%;
        z-index: 3;
        box-shadow: 0px 1px 3px rgba(0,0,0,0.5);
    }

    .black-key h1 {
        color: rgba(255, 255, 255, 0.4);
        user-select: none;
        align-self: flex-end;
        font-size: var(--key-label-size);
        font-family: var(--key-label-font-family);
        font-weight: var(--key-label-font-weight);
    }

    .black-key--hover {
        background: var(--black-key-hover-colour);
        padding-bottom: .5ch;
    }

    .black-key--pressed {
        color: rgba(255, 255, 255, 1) !important;
        background: var(--black-key-active-colour);
        padding-bottom: .5ch;
    }
</style>