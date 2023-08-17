<script>
import hotkey from '$lib/stores/HotkeyStore'
import piano from '$lib/stores/PianoStore'
import { Note } from "tonal";

function controller(e) {
    const interval = e.ctrlKey ? "8P" : "2m";
    if (e.keyCode == 37) {
        $piano.updateKeyboard();
        $hotkey.setBase(Note.transpose($hotkey.base, "-"+interval))
    } else if (e.keyCode == 39) {
        $piano.updateKeyboard();
        $hotkey.setBase(Note.transpose($hotkey.base, interval))
    }
}

function hotkeyBaseSubmit(e) {
    e.target.value = $hotkey.setBase(e.target.value);
}

function splitOffsetSubmit(e) {
    $hotkey.setOffset(parseInt(e.target.value));
}

</script>

<svelte:window on:keydown={controller}/>
<div class="flex-col">
    <div class="flex-row">
        <div class="flex-container">
            <label for="hotkey">Hotkeys:</label>
            <input id="hotkey" type="checkbox" checked={$hotkey.showHotkeys} on:change={() => $hotkey.toggleHotkeys()}>
        </div>
        <div class="flex-container">
            <label for="guide">Guides:</label>
            <input id="guide" type="checkbox" checked={$hotkey.showHotkeyGuides} on:change={() => $hotkey.toggleGuides()}>
        </div>
    </div>
    <div class="flex-row">
        <div class="flex-container">
            <label for="hotkey">Base:</label>
            <input type="text" id="hotkey" maxlength="4" value={$hotkey.base} on:blur={hotkeyBaseSubmit}>
        </div>
        <div class="flex-container">
            <label for="guide">Split:</label>
            <input type="number" id="guide" maxlength="2" min="0" value={$hotkey.splitOffset} on:change={splitOffsetSubmit}>
        </div>
    </div>
    <div class="flex-row" style="justify-content: center;">
        <div class="icon icon-keyboard-invert" class:icon--active={$hotkey.mode == 1} on:click={$hotkey.setMode(1)}></div>
        <div class="icon icon-split-keyboard-invert" class:icon--active={$hotkey.mode == 2} on:click={$hotkey.setMode(2)}></div>
    </div>
</div>

<style>
    .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input[type=text], input[type=number] {
        width: 4ch;
        height: 2ch;
    }

    input[type=checkbox] {
        margin: 0;
    }

    label {
        color: var(--text-gold);
        font-size: .8rem;
    }

    .icon--active {
        color: var(--text-gold);
    }
</style>