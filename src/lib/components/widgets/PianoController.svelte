<script>
import piano from '$lib/stores/PianoStore'
import { getSoundfontNames } from "smplr";
import InputNumber from '../general/InputNumber.svelte';
import InputNote from '../general/InputNote.svelte';
import { toastMessage } from '$lib/stores/GlobalStore'

function controller(e) {
    const interval = e.ctrlKey ? "8P" : "2M";
    if (e.keyCode == 38) {
        $piano.updateKeyboard();
        $piano.stepRange(interval, true);
    } else if (e.keyCode == 40) {
        $piano.updateKeyboard();
        $piano.stepRange("-"+interval, true);
    }
}

function handleInstrumentChange(e) {
    $piano.setInstrument(e.target.value);
}

</script>

<svelte:window on:keydown={controller}/>
<div class="flex-col">
    <div class="flex-row">
        <div class="label-container">
            <select value={$piano.instrument} on:change={handleInstrumentChange} on:keydown={e => e.target.blur()}>
                {#each getSoundfontNames() as instr (instr)}
                    <option on:click={e => e.target.parentElement.blur()}>{ instr }</option>
                {/each}
            </select>
            <label for="instrument">instrument</label>
        </div>
    </div>
    <div class="flex-row">
        <div class="label-container">
            <InputNumber id="volume" max={127} min={0} step={2} inputValue={$piano.volume} on:change={e => $piano.setVolume(e.detail)}></InputNumber>
            <label for="volume">volume</label>
        </div>
        <div class="label-container">
            <InputNumber id="velocity" max={127} min={0} step={2} inputValue={$piano.velocity} on:change={e => $piano.setVelocity(e.detail)}></InputNumber>
            <label for="velocity">velocity</label>
        </div>
        <div class="label-container">
            <InputNumber id="reverb" max={1} min={0} step={.1} inputValue={$piano.reverb} on:change={e => $piano.setReverb(e.detail)}></InputNumber>
            <label for="reverb">reverb</label>
        </div>
    </div>
    <div class="flex-row">
        <div class="label-container">
            <div class="flex-row">
                <InputNote id="min" inputNote={$piano.minNote} on:change={e => $piano.setMin(e.detail)}></InputNote>
                <div class="arrow">&#10231;</div>
                <InputNote id="max" inputNote={$piano.maxNote} on:change={e => $piano.setMax(e.detail)}></InputNote>
            </div>
            <label for="range">range</label>
        </div>
    </div>
</div>

<style>
    .arrow {
        font-size: 1.5rem;
        margin-top: -2rem;
        margin-bottom: -1.6rem;
    }

    select {
        width: 16ch;
    }
</style>