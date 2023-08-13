<script>

import RibbonLane from './RibbonLane.Svelte'
import piano from '$lib/stores/PianoStore'

</script>

<div id="ribbon-panel">
    <div class="lane-container">
        {#each $piano.keyboard as note}
            <RibbonLane note={note}></RibbonLane>
        {/each}
    </div>
</div>

<style>
    #ribbon-panel {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        grid-area: main-panel;
    }

    .lane-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-flow: row;
    }
</style>