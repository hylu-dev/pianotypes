<script>
import piano from '$lib/stores/PianoStore'
import hotkey from '$lib/stores/HotkeyStore'
import { Note } from "tonal";
import { getSoundfontNames } from "smplr";

function controller(e) {
    const interval = e.ctrlKey ? "8P" : "2m";
    if (e.keyCode == 38) {
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
<div class="flex-col">
    <div class="flex-row">
        <select value={$piano.instrument} on:change={e => $piano.setInstrument(e.target.value)} on:keydown={e => e.target.blur()}>
            {#each getSoundfontNames() as instr (instr)}
                <option on:click={e => e.target.parentElement.blur()}>{ instr }</option>
            {/each}
        </select>
    </div>
    <div class="flex-row">
        <div class="range-container">
        <input type="text" id="min" maxlength="4" value={$piano.minNote} on:blur={minNoteSubmit}>
        <span style="transform: translateY(-3px);">&#10231;</span>
        <input type="text" id="max" maxlength="4" value={$piano.maxNote} on:blur={maxNoteSubmit}>
        </div>
        
    </div>
</div>

<style>
    .range-container {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        gap: 1ch;
    }

    input[type=text] {
        width: 4ch;
        height: 2ch;
    }

    select {
        width: 20ch;
    }
</style>