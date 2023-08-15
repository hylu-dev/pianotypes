<script>
import piano from '$lib/stores/PianoStore'
import { fade } from 'svelte/transition';
</script>   

<div id="note-display" transition:fade={{ delay: 250, duration: 300 }}>
    <div>{ $piano.lastPress }</div>
</div>

<style>
    #note-display {
        display: grid;
        place-items: center center;
        font-size: min(10rem, 12vw);
        user-select: none;
        color: var(--text-dark);
        grid-area: main-panel;
    }
</style>