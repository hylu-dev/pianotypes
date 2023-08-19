<script>
import piano from '$lib/stores/PianoStore'
import InputNumber from '../general/InputNumber.svelte';
import { onMount } from 'svelte'

let mm;
let music_rnn;
let files = '';
let fileBuffer;
let temperature = .7;
let steps = 200;
let trim = true;
let error = '';
let loading = false;

onMount(() => {
    // Hacky way to get magentajs through cdn since I can't import it as an esModule :/
    mm = window.mm 
    music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
    music_rnn.initialize();
})

function loadFile(e) {
    $piano.releaseAll();
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file) reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
        fileBuffer = reader.result;
    }
}

function playMidiFromFile() {
    $piano.player.stop();
    if (fileBuffer){
        let seq = mm.midiToSequenceProto(fileBuffer);
        if (trim) seq = mm.sequences.trim(seq, 0, 60);
        console.log(`Playing ${seq.notes.length} notes`)
        seq.notes.forEach(note => {
            $piano.scheduleKey(note.pitch, parseInt(note.velocity), note.startTime, note.endTime-note.startTime);
        })
    }
}

async function playGenerativeFromFile() {
    loading = true;
    error = '';
    let seq, qns;
    try {
        seq = mm.midiToSequenceProto(fileBuffer);
        seq = mm.sequences.mergeInstruments(seq);
        if (trim) seq = mm.sequences.trim(seq, 0, 60);
        qns = mm.sequences.quantizeNoteSequence(seq, 4);
        music_rnn
            .continueSequence(qns, steps, temperature)
            .then(sample => {
                playFromQuantizedSample(sample)
            }).catch(err => {
                console.log(err);
                error = err;
            })
    } catch (err) {
        console.log(err);
        error = err;
    }
}

function playFromQuantizedSample(sample) {
    const secondsPerQuarterNote = 1/(sample.tempos[0]['qpm']/60);
    const stepsPerQuarter = sample.quantizationInfo['stepsPerQuarter'];
    const tempoMultiplier = secondsPerQuarterNote/stepsPerQuarter
    sample.notes.forEach(note => {
        let duration = note.quantizedEndStep*tempoMultiplier;
        let time = note.quantizedStartStep*tempoMultiplier;
        $piano.scheduleKey(note.pitch, undefined, time, duration);
    })
}

function stopPiano() {
    $piano.releaseAll();
}
</script>

{#if mm}
<div class="flex-col container">
    <div class="flex-row">
        <label for="midi-upload" class="file-input">
            {#if files && files[0]}
                <span>{files[0].name}</span>
            {:else}
                <span>upload midi</span>
            {/if}
        </label>
        <input type="file" id="midi-upload" name="midi" accept=".mid,.midi" bind:files={files} on:change={loadFile}>
        <button class:disabled={!fileBuffer} class="hanging" on:click={stopPiano}>&#9724;</button>
        <button class:disabled={!fileBuffer} class="hanging" on:click={playMidiFromFile}>&#9658;</button>
    </div>
    <div class="flex-row">
        <div class="label-container">
            <InputNumber id="steps" max={999} min={0} step={10} inputValue={steps} on:change={e => steps = e.detail}></InputNumber>
            <label for="steps">steps</label>
        </div>
        <div class="label-container">
            <InputNumber id="temp" --width="4ch" max={99} min={0} step={.1} inputValue={temperature} on:change={e => temperature = e.detail}></InputNumber>
            <label for="temp">temperature</label>
        </div>
        <div class="label-container">
            <input id="trim" type="checkbox" bind:checked={trim}>
            <label for="trim">trim</label>    
        </div>
    </div>
    <div class="flex-row">
        <button class:disabled={!fileBuffer} class="hanging" on:click={playGenerativeFromFile}>Generate</button>
    </div>
    
</div>
{#if error}<div class="flex-col error">{error}</div>{/if}
{/if}

<style>
    .hanging:active {
        filter: invert(1);
    }

    .error {
        font-size: .5em;
        color:red;
        text-align: center;
        white-space: wrap;
        width: 50px;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        word-wrap: break-word;
    }

    input[type=number] {
        width: 6ch;
        height: 2ch;
    }

    .flex-col {
        max-width: 150px;
    }

    .flex-row {
        justify-content: center;
    }

    .disabled {
        pointer-events: none;
        opacity: .5;
        filter:contrast(2);
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