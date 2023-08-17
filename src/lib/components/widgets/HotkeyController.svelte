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
        <div class="label-container">
            <input id="hotkey" type="checkbox" checked={$hotkey.showHotkeys} on:change={() => $hotkey.toggleHotkeys()}>
            <label for="hotkey">Hotkeys</label>
        </div>
        <div class="label-container">
            <input id="guide" type="checkbox" checked={$hotkey.showHotkeyGuides} on:change={() => $hotkey.toggleGuides()}>
            <label for="hotkey">Guides</label>
        </div>            
    </div>
    <div class="flex-row">
        <div class="label-container">
            <input type="text" id="hotkey" maxlength="4" value={$hotkey.base} on:blur={hotkeyBaseSubmit}>
            <label for="hotkey">Base</label>
        </div>
        <div class="label-container">
            <input type="number" id="guide" maxlength="2" min="0" value={$hotkey.splitOffset} on:change={splitOffsetSubmit}>
            <label for="guide">Split</label>
        </div>            
    </div>
    <div class="flex-row">
        <div class="icon icon-keyboard-invert" class:icon--active={$hotkey.mode == 1} on:click={$hotkey.setMode(1)} role="none"></div>
        <div class="icon icon-split-keyboard-invert" class:icon--active={$hotkey.mode == 2} on:click={$hotkey.setMode(2)} role="none"></div>
    </div>
</div>

<style>
    .flex-row {
        justify-content: space-evenly;
    }

    input[type=checkbox] {
        margin: none;
    }

    input[type=text], input[type=number] {
        width: 4ch;
        height: 2ch;
    }

    .icon--active {
        color: var(--text-gold);
    }
</style>