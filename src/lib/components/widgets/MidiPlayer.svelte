<script>
    import MidiPlayer from 'midi-player-js';

    const Player = new MidiPlayer.Player(function(e) {
        console.log(e);
    });
    
</script>

<div>
    <h2>MidiPlayer</h2>
    <input type="file" id="midiFile" name="midi">
    <input type="submit">
</div>

<style>

</style>
