<script>
    import MidiPlayer from 'midi-player-js';
    import { Note } from "tonal";
    import piano from '$lib/stores/PianoStore'

    const Player = new MidiPlayer.Player();

    let loaded = false;
    let files = '';
    let songProgress = 0;
    let songTime = 0;
    let isPlaying = false;

    Player.on('fileLoaded', function() {
        loaded = true;
        songTime = Player.getSongTime;
    });

    Player.on('midiEvent', function(e) {
        if (e.noteNumber < Note.midi($piano.minNote)) $piano.setMin(e.noteName);
        if (e.noteNumber > Note.midi($piano.maxNote)) $piano.setMax(e.noteName);
        if (e.name === "Note on") {
            if (e.velocity === 0) {
                $piano.releaseKey(e.noteName);
            } else {
                $piano.pressKey(e.noteName, e.velocity);
            }
        }
        if (e.name === "Note off") {
            $piano.releaseKey(e.noteName);
        }
    });

    
    Player.on('playing', function(currentTick) {
        songProgress = Player.getSongPercentRemaining();
    });

    function loadFile(e) {
        Player.stop()
        $piano.releaseAll();
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) reader.readAsArrayBuffer(file);
        reader.addEventListener("load", function () {
			Player.loadArrayBuffer(reader.result);
		}, false);
    }

    function playPlayer() {
        Player.play();
        isPlaying = true;
    }

    function pausePlayer() {
        Player.pause();
        isPlaying = false;
        $piano.releaseAll();
    }

</script>

<div id="midi-wrapper">
    <div class="midi-row">
    </div>
    <div class="midi-row">
        <label for="file-upload" class="file-input">
            {#if files && files[0]}
                <span>{files[0].name}</span>
            {:else}
                <span>Upload Midi</span>
            {/if}
        </label>
        <input type="file" id="file-upload" name="midi" accept=".mid,.midi" bind:files={files} on:change={loadFile}>
    </div>
    <div class="midi-row">
        <button class:active={!isPlaying} disabled={!loaded} on:click={pausePlayer}> &#9208;</button>
        <button class:active={isPlaying} disabled={!loaded} on:click={playPlayer}>&#9658;</button>
    </div>
</div>

<style>
    #midi-wrapper {
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: space-evenly;
        gap: .6rem;
    }

    .midi-row {
        display: flex;
        justify-content: flex-start;
        flex-grow: 1;
        gap: 1ch;
    }

    .active {
        color: var(--text-gold);
        background-color: var(--bg-light);
    }

    .file-input {
        background: var(--bg-dark-grey);
        color: var(--text-grey);
        font-family: 'Source Code Pro', Helvetica, Arial, sans-serif;
        border: solid var(--bg-light);
        text-align: center;
        padding: .8ch;
        font-size: .5rem;
        box-sizing: border-box;
        max-width: 20ch;
        text-align: center;
        overflow:hidden;
    }

    .file-input:hover {
        background: var(--bg-grey);
        color: var(--text-gold);
    }
</style>
