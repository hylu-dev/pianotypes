<script>
import piano from '$lib/stores/PianoStore'
import { onMount } from 'svelte'

let mm;
let music_rnn;
let files = '';
let fileBuffer;

let isGenerating = false;

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

function playMidi() {
    if (fileBuffer){
        const seq = mm.midiToSequenceProto(fileBuffer);
        seq.notes.forEach(note => {
        const time = $piano.ac.currentTime;
        $piano.player.start({ note: note.pitch, time: time+note.startTime, duration: time+note.endTime });
        })
    }
}

async function playGenerative() {
    let seq = mm.midiToSequenceProto(fileBuffer);
    seq = mm.sequences.mergeInstruments(seq);
    seq = mm.sequences.trim(seq, 0, 120);
    const qns = mm.sequences.quantizeNoteSequence(seq, 4);
    const rnn_steps = 100;
    const rnn_temperature = 1.;
    music_rnn
    .continueSequence(qns, rnn_steps, rnn_temperature)
    .then(sample => {
        playFromSample(sample)
    }).catch(err => {
        console.log(err);
    });
}

function playFromSample(sample) {
    const secondsPerQuarterNote = 1/(sample.tempos[0]['qpm']/60);
    const stepsPerQuarter = sample.quantizationInfo['stepsPerQuarter'];
    const tempoMultiplier = secondsPerQuarterNote/stepsPerQuarter
    sample.notes.forEach(note => {
        let duration = (note.quantizedEndStep - note.quantizedStartStep)*tempoMultiplier;
        let time = $piano.ac.currentTime + note.quantizedStartStep*tempoMultiplier;
        $piano.player.start({ note: note.pitch, time, duration: duration });
    })
}

function stopPiano() {
    $piano.releaseAll();
}

</script>

{#if mm}
<div class="flex-col container">
    <div class="flex-row">
        <small style="color: var(--text-gold)">Magenta</small>
    </div>
    <div class="flex-row">
        <label for="midi-upload" class="file-input">
            {#if files && files[0]}
                <span>{files[0].name}</span>
            {:else}
                <span>Upload Midi</span>
            {/if}
        </label>
        <input type="file" id="midi-upload" name="midi" accept=".mid,.midi" bind:files={files} on:change={loadFile}>
    </div>
    <div class="flex-row">
        <button class:disabled={!fileBuffer} on:click={stopPiano}>&#9208;</button>
        <button class:disabled={!fileBuffer} on:click={playMidi}>&#9658;</button>
    </div>
    <div class="flex-row">
        <button on:click={playGenerative}>Generate</button>
    </div>
</div>
{/if}

<style>
.flex-col {
    width: 200px;
}

.flex-row {
    justify-content: start;
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