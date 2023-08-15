<script>
    import MidiPlayer from 'midi-player-js';
    import { Note } from "tonal";
    import piano from '$lib/stores/PianoStore'

    const Player = new MidiPlayer.Player();

    let loaded = false;

    Player.on('fileLoaded', function() {
        loaded = true;
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

    function pausePlayer() {
        Player.pause()
        $piano.releaseAll();
    }

</script>

<div>
    <h2>MidiPlayer</h2>
    <input type="file" id="midiFile" name="midi" accept=".mid,.midi" on:change={loadFile}>
    <button class:inactive={!loaded} disabled={!loaded} on:click={pausePlayer}> &#9208;</button>
    <button class:inactive={!loaded} disabled={!loaded} on:click={() => Player.play()}>&#9658;</button>
</div>

<style>

    .inactive {
        filter: brightness(.6);

    }

</style>
