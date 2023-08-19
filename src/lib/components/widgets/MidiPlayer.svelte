<script>
    import MidiPlayer from 'midi-player-js';
    import piano from '$lib/stores/PianoStore'

    const midiPlayer = new MidiPlayer.Player();

    let loaded = false;
    let files = '';
    let songProgress = 0;
    let songTime = '';
    let isPlaying = false;

    updateSongTime(0);

    midiPlayer.on('fileLoaded', function() {
        loaded = true;
        songProgress = 0;
    });

    midiPlayer.on('midiEvent', function(e) {
        if (e.name === "Controller Change") {}
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

    
    midiPlayer.on('playing', () => {
        songProgress = 100-midiPlayer.getSongPercentRemaining();
        updateSongTime(midiPlayer.getSongTimeRemaining());
        
    });

    function updateSongTime(totalSeconds) {
        let minutes = ~~(totalSeconds / 60)
        let seconds = (totalSeconds % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        songTime = `${minutes}:${seconds}`;
    }

    function loadFile(e) {
        midiPlayer.stop()
        isPlaying = false;
        $piano.releaseAll();
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            midiPlayer.loadArrayBuffer(reader.result);
        }
    }

    function playMidi() {
        isPlaying = true;
        midiPlayer.play();
    }

    function pauseMidi() {
        midiPlayer.pause();
        isPlaying = false;
        $piano.releaseAll();
    }

    function skipMidi() {
        if (songProgress < 95) {
            midiPlayer.skipToPercent(songProgress + 5);
            songProgress += 5;
            updateSongTime(midiPlayer.getSongTimeRemaining());
        }
        $piano.releaseAll();
        if (isPlaying) midiPlayer.play();
    }

    function reverseMidi() {
        if (songProgress > 5) {
            midiPlayer.skipToPercent(songProgress - 5);
            songProgress -= 5;
            updateSongTime(midiPlayer.getSongTimeRemaining());
        }
        $piano.releaseAll();
        if (isPlaying) midiPlayer.play();
    }

</script>

<div class="flex-col">
    <div class="flex-row">
        <small style="color: var(--text-gold)">midi player</small>
    </div>
    <div class="flex-row">
        <div id="progress-container">
            <div id="progress-fill" style:width={songProgress+"%"}>{songTime}</div>
        </div>
    </div>
    <div class="flex-row">
        <label for="file-upload" class="file-input">
            {#if files && files[0]}
                <span>{files[0].name}</span>
            {:else}
                <span>upload midi</span>
            {/if}
        </label>
        <input type="file" id="file-upload" name="midi" accept=".mid,.midi" bind:files={files} on:change={loadFile}>
    </div>
    <div class="flex-row">
        <button class:disabled={!loaded} disabled={!loaded} on:click={reverseMidi}>&#171;</button>
        <button class:active={!isPlaying&&loaded} class:disabled={!loaded} disabled={!loaded} on:click={pauseMidi}>&#9208;</button>
        <button class:active={isPlaying} class:disabled={!loaded} disabled={!loaded} on:click={playMidi}>&#9658;</button>
        <button class:disabled={!loaded} disabled={!loaded} on:click={skipMidi}>&#187;</button>
    </div>
</div>

<style>
    .flex-col {
        width: 120px;
    }

    #progress-container {
        width: 100%;
        height: 1ch;
        background-color: var(--bg-grey);
        line-height: 1ch;
        color: var(--text-gold);
    }

    #progress-fill {
        height: 100%;
        background-color: var(--bg-light);
        text-align: center;
        font-size: 1ch;
        padding: auto;
    }

    .disabled {
        pointer-events: none;
        filter: brightness(.4);
    }

    .active {
        background-color: var(--bg-light);
        color: var(--text-gold);
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
