<script>
import hotkey from '$lib/stores/HotkeyStore'
import piano from '$lib/stores/PianoStore'
import { Note } from "tonal";
import InputNumber from '../general/InputNumber.svelte';
import InputNote from '../general/InputNote.svelte';
import { inputFocused } from '$lib/stores/GlobalStore'

function controller(e) {
    if (inputFocused) return;
    const interval = e.ctrlKey ? "8P" : "2M";
    if (e.keyCode === 37) {
        $piano.updateKeyboard();
        $hotkey.setBase(Note.transpose($hotkey.base, "-"+interval), true)
    } else if (e.keyCode === 39) {
        $piano.updateKeyboard();
        $hotkey.setBase(Note.transpose($hotkey.base, interval), true)
    } else if (e.key === '`') {
        $hotkey.setSplit();
    } else if (e.key === '\\') {
        $hotkey.setGuides();
    } 
}

</script>

<svelte:window on:keydown={controller}/>
<div class="flex-col">
    <div class="flex-row">
        <div class="label-container">
            <input id="hotkey" type="checkbox" checked={$hotkey.showHotkeys} on:change={() => $hotkey.setHotkeys()}>
            <label for="hotkey">hotkeys</label>
        </div>
        <div class="label-container">
            <input id="guide" type="checkbox" checked={$hotkey.showHotkeyGuides} on:change={() => $hotkey.setGuides()}>
            <label for="guide">guides</label>
        </div>            
    </div>
    <div class="flex-row">
        <div class="label-container">
            <InputNote id="hotkey" inputNote={$hotkey.base} on:change={e => $hotkey.setBase(e.detail)}></InputNote>
            <label for="hotkey">base</label>
        </div>
        <div class="label-container">
            <InputNumber id="split-offset"--width="4ch" max={88} min={0} inputValue={$hotkey.splitOffset} on:change={e => $hotkey.setSplitOffset(parseInt(e.detail))}></InputNumber>
            <label for="split-offset">split</label>
        </div>            
    </div>
    <div class="flex-row">
        <div class="icon icon-keyboard-invert" class:icon--active={!$hotkey.splitMode} on:click={() => $hotkey.setSplit(false)} role="none"></div>
        <div class="icon icon-split-keyboard-invert" class:icon--active={$hotkey.splitMode} on:click={() => $hotkey.setSplit(true)} role="none"></div>
    </div>
</div>

<style>
    .flex-row {
        justify-content: space-evenly;
    }

    input[type=checkbox] {
        margin: none;
    }

    .icon {
        font-size: 1.5rem;
    }

    .icon--active {
        color: var(--text-gold);
    }
</style>