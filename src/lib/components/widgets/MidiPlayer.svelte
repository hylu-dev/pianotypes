<script>
    import MidiPlayer from 'midi-player-js';

    const Player = new MidiPlayer.Player(function(e) {
        console.log(e);
    });

    function loadFile(e) {
        const file = e.target.files[0];
        console.log(file);
    }
    
</script>

<div>
    <h2>MidiPlayer</h2>
    <input type="file" id="midiFile" name="midi" accept=".mid,.midi" on:change={loadFile}>
    <input type="submit">
</div>

<style>

</style>
