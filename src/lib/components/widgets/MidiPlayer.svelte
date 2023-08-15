<script>
    import MidiPlayer from 'midi-player-js';
    import piano from '$lib/stores/PianoStore'

    const Player = new MidiPlayer.Player();

    let loaded = false;

    Player.on('fileLoaded', function() {
        loaded = true;
    });

    Player.on('midiEvent', function(e) {
        if (e.name === "Note on") {
            $piano.pressKey(e.noteName, e.velocity);
        }
        if (e.name === "Note off") {
            $piano.releaseKey(e.noteName);
        }
    });

    function loadFile(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) reader.readAsArrayBuffer(file);
        reader.addEventListener("load", function () {
			Player.loadArrayBuffer(reader.result);
		}, false);
    }

</script>

<div>
    <h2>MidiPlayer</h2>
    <input type="file" id="midiFile" name="midi" accept=".mid,.midi" on:change={loadFile}>
    <button class:inactive={!loaded} disabled={!loaded} on:click={() => Player.stop()}>Stop</button>
    <button class:inactive={!loaded} disabled={!loaded} on:click={() => Player.play()}>Play</button>
</div>

<style>

    .inactive {
        filter: brightness(.6);

    }

</style>
