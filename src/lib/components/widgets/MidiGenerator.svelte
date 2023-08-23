<script>
import piano from '$lib/stores/PianoStore'
import InputNumber from '../general/InputNumber.svelte';
import { onMount } from 'svelte'
import { toastMessage } from '$lib/stores/GlobalStore'

let mm;
let music_rnn;
let files = '';
let temperature = .7;
let steps = 200;
let trim = false;
let trimLength = 60;
let seq;
let intervalId = 0;

onMount(() => {
    // Hacky way to get magentajs through cdn since I can't import it as an esModule :/
    mm = window.mm 
    music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
    music_rnn.initialize();
})

function loadFile(e) {
    $piano.releaseAll();
    $piano.updateInstrument(); // ensure AudioContext timers are synced
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file) reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
        let fileBuffer = reader.result;
        seq = mm.midiToSequenceProto(fileBuffer);
        seq = mm.sequences.mergeInstruments(seq);
        seq = mm.sequences.applySustainControlChanges(seq);
        console.log(seq);
        toastMessage.set(`Loaded ${seq.notes.length} notes (${~~seq.totalTime} sec)`);
    }
}

function playMidiFromFile() {
    $piano.player.stop();
    let sample = seq;
    if (trim) sample = mm.sequences.trim(seq, 0, Math.min(sample.totalTime, trimLength));
    toastMessage.set(`Scheduled ${sample.notes.length} notes (${~~sample.totalTime} sec)`)
    sample.notes.forEach(note => {
        $piano.scheduleKey(note.pitch, parseInt(note.velocity), note.startTime, note.endTime-note.startTime);
    })
    $piano.scheduleCallback(sample.totalTime, () => toastMessage.set("Playback finished"));
}

async function playGenerativeFromFile() {
    try {
        let sample = seq;
        if (trim) sample = mm.sequences.trim(seq, 0, Math.min(sample.totalTime, trimLength));
        let qns = mm.sequences.quantizeNoteSequence(sample, 4);
        music_rnn
            .continueSequence(qns, steps, temperature)
            .then(sample => {
                playFromQuantizedSample(sample)
            }).catch(err => {
                toastMessage.set(`Incompatible Midi ${err}`);
            })
    } catch (err) {
        toastMessage.set(`Incompatible Midi ${err}`);
    }
}

function playFromQuantizedSample(sample) {
    const stepsPerSecond = mm.sequences.stepsPerQuarterToStepsPerSecond(
        sample.quantizationInfo['stepsPerQuarter'],
        sample.tempos[0]['qpm']
    );
    const totalLength = sample.totalQuantizedSteps/stepsPerSecond;
    toastMessage.set(`Scheduled ${sample.notes.length} notes (${totalLength} sec)`)
    sample.notes.forEach(note => {
        const duration = note.quantizedEndStep/stepsPerSecond;
        const time = note.quantizedStartStep/stepsPerSecond;
        $piano.scheduleKey(note.pitch, undefined, time, duration);
    })
    $piano.scheduleCallback(totalLength, () => toastMessage.set("Playback finished"));
}

function stopPiano() {
    toastMessage.set(`Stopping scheduled notes`);
    $piano.releaseAll();
}
</script>

{#if mm}
<div class="flex-col">
    <div class="flex-row">
        <small style="color: var(--text-gold)">magenta.js</small>
    </div>
    <div class="flex-row">
        <div class="flex-col half-col">
            <label for="midi-upload" class="file-input">
                {#if files && files[0]}
                    <span>{files[0].name}</span>
                {:else}
                    <span>upload midi</span>
                {/if}
            </label>
            <input type="file" id="midi-upload" name="midi" accept=".mid,.midi" bind:files={files} on:change={loadFile}>
            <div class="flex-row">
                <button class:disabled={!seq} class="hanging" on:click={stopPiano}>&#9724;</button>
                <button class:disabled={!seq} class="hanging" on:click={playMidiFromFile}>&#9658;</button>
            </div>
            <div class="flex-row">
                <div class="label-container">
                    <input id="trim" type="checkbox" bind:checked={trim} on:change={() => trim ? toastMessage.set(`Trim song to ${trimLength} seconds`):null}>
                    <label for="trim">trim</label>    
                </div>
                <div class="label-container" class:disabled={!trim}>
                    <InputNumber id="trim-length" max={999} min={0} step={1} inputValue={trimLength} on:change={ e => trimLength = e.detail}></InputNumber>
                    <label for="trim-length">length</label>    
                </div>
            </div>
        </div>
        <div class="vertical-line-break"></div>
        <div class="flex-col half-col">
            <div class="label-container">
                <InputNumber id="steps" max={999} min={0} step={10} inputValue={steps} on:change={e => steps = e.detail}></InputNumber>
                <label for="steps">steps</label>
            </div>
            <div class="label-container">
                <InputNumber id="temp" --width="4ch" max={99} min={0} step={.1} inputValue={temperature} on:change={e => temperature = e.detail}></InputNumber>
                <label for="temp">temperature</label>
            </div>
            <button class:disabled={!seq} class="hanging" on:click={playGenerativeFromFile}>Generate</button>
        </div>
    </div>
</div>
{/if}

<style>
    .vertical-line-break {
        width: 0;
        height: 100%;
        border-radius: 5px;
        border: solid 1px var(--bg-dark-grey);
    }

    .hanging:active {
        filter: invert(1);
    }

    .half-col {
        width: 50%;
    }

    .flex-col {
        max-width: 150px;
        gap: 0.4rem;
    }

    .flex-row {
        justify-content: center;
    }

    .disabled {
        pointer-events: none;
        filter: brightness(.4);
    }

    .file-input {
        background: var(--bg-dark);
        color: var(--text-grey);
        border-radius: 2px;
        font-family: 'Source Code Pro', Helvetica, Arial, sans-serif;
        border: solid 2px var(--bg-light);
        text-align: center;
        padding: .8ch;
        font-size: .5rem;
        box-sizing: border-box;
        width: 100%;
        white-space: nowrap;
        text-align: center;
        overflow:hidden;
    }

    .file-input:hover {
        background: var(--bg-grey);
        color: var(--text-gold);
    }
</style>