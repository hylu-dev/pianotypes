<script>
import piano from '$lib/stores/PianoStore'
import { getSoundfontNames } from "smplr";
import InputNumber from '../general/InputNumber.svelte';
import InputNote from '../general/InputNote.svelte';

function controller(e) {
    const interval = e.ctrlKey ? "8P" : "2m";
    if (e.keyCode == 38) {
        $piano.updateKeyboard();
        $piano.stepRange(interval);
    } else if (e.keyCode == 40) {
        $piano.updateKeyboard();
        $piano.stepRange("-"+interval);
    }
}

function minNoteSubmit(e) {
    $piano.setMin(e.detail);
}

function maxNoteSubmit(e) {
    $piano.setMax(e.detail);
}
</script>

<svelte:window on:keydown={controller}/>
<div class="flex-col">
    <div class="flex-row">
        <div class="label-container">
            <select value={$piano.instrument} on:change={e => $piano.setInstrument(e.target.value)} on:keydown={e => e.target.blur()}>
                {#each getSoundfontNames() as instr (instr)}
                    <option on:click={e => e.target.parentElement.blur()}>{ instr }</option>
                {/each}
            </select>
            <label for="instrument">Instrument</label>
        </div>
    </div>
    <div class="flex-row">
        <div class="label-container">
            <InputNumber id="volume" max={127} min={0} inputValue={$piano.volume} on:change={e => $piano.setVolume(e.detail)}></InputNumber>
            <label for="volume">Volume</label>
        </div>
        <div class="label-container">
            <InputNumber id="velocity" max={127} min={0} inputValue={$piano.velocity} on:change={e => $piano.setVelocity(e.detail)}></InputNumber>
            <label for="velocity">velocity</label>
        </div>
        <div class="label-container">
            <InputNumber id="reverb" max={1} min={0} step={.1} inputValue={$piano.reverb} on:change={e => $piano.setReverb(e.detail)}></InputNumber>
            <label for="reverb">Reverb</label>
        </div>
    </div>
    <div class="flex-row">
        <div class="label-container">
            <div class="flex-row">
                <InputNote id="min" inputNote={$piano.minNote} on:change={minNoteSubmit}></InputNote>
                <div class="arrow">&#10231;</div>
                <InputNote id="max" inputNote={$piano.maxNote} on:change={maxNoteSubmit}></InputNote>
            </div>
            <label for="range">Range</label>
        </div>
    </div>
</div>

<style>
    .arrow {
        font-size: 1.5rem;
        margin-top: -2rem;
        margin-bottom: -1.6rem;
    }

    input[type=text] {
        width: 4ch;
        height: 2ch;
    }

    select {
        width: 16ch;
    }
</style>