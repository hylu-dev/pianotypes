<script>
import piano from '$lib/stores/PianoStore'
import hotkey from '$lib/stores/HotkeyStore'
import { Note } from "tonal";
import instruments from "$lib/json/musyngkite.json"

function controller(e) {
    const interval = e.ctrlKey ? "8P" : "2m";
    if (e.keyCode == 37) {
        $piano.updateKeyboard();
        $hotkey.setBase(Note.transpose($hotkey.base, "-"+interval))
    } else if (e.keyCode == 39) {
        $piano.updateKeyboard();
        $hotkey.setBase(Note.transpose($hotkey.base, interval))
    } else if (e.keyCode == 38) {
        $piano.updateKeyboard();
        $piano.setMax(Note.transpose($piano.maxNote, interval))
        $piano.setMin(Note.transpose($piano.minNote, "-"+interval))
    } else if (e.keyCode == 40) {
        $piano.updateKeyboard();
        $piano.setMax(Note.transpose($piano.maxNote, "-"+interval))
        $piano.setMin(Note.transpose($piano.minNote, interval))
    }
}

function minNoteSubmit(e) {
    e.target.value = $piano.setMin(e.target.value);
}

function maxNoteSubmit(e) {
    e.target.value = $piano.setMax(e.target.value);
}


</script>

<svelte:window on:keydown={controller}/>
<div class="flex-col-container">
    <div class="flex-row-container">
        <select value={$piano.instrument} on:change={e => $piano.setInstrument(e.target.value)} on:keydown={e => e.target.blur()}>
            {#each instruments as instr (instr)}
                <option on:click={e => e.target.parentElement.blur()}>{ instr }</option>
            {/each}
        </select>
    </div>
    <div class="flex-row-container">
        <input type="text" id="min" maxlength="4" value={$piano.minNote} on:blur={minNoteSubmit}>
        &#8250;
        <input type="text" id="max" maxlength="4" value={$piano.maxNote} on:blur={maxNoteSubmit}>
    </div>
    <div class="flex-row-container">
        <!-- <input type="text" id="max" v-model="this.noteBinding" maxlength="3" @keypress.enter="$event.target.blur()"> -->
        <div class="icon-keyboard-invert" class:icon--active={$hotkey.mode == 1} on:click={$hotkey.setMode(1)}></div>
        <div class="icon-split-keyboard-invert" class:icon--active={$hotkey.mode == 2} on:click={$hotkey.setMode(2)}></div>
    </div> 
</div>

<style>
    .flex-col-container {
        display: flex;
        justify-content: center;
        flex-flow: column;
        user-select: none;
        gap: .6rem;
    }

    .flex-row-container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-flow: row;
        font-size: 2rem;
        line-height: 0;
    }

    input[type=text] {
        width: 4ch;
        height: 2ch;
        text-align: center;
        font-weight: 600;
    }

    select {
        width: 20ch;
    }

    .icon-keyboard-invert, .icon-split-keyboard-invert {
        font-size: 2rem;
        color: var(--text-grey);
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .icon-keyboard-invert:hover, .icon-split-keyboard-invert:hover {
        filter: brightness(1.1);
        transform: scale(1.1);
    }

    .icon--active {
        color: var(--text-gold);
    }
</style>