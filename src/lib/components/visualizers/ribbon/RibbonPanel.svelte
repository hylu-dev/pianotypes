<script>
import RibbonLane from './RibbonLane.svelte'
import { keyboard } from '$lib/stores/PianoStore'

</script>

<div id="ribbon-panel">
    <div class="lane-container">
        {#each $keyboard as note (note)}
            <RibbonLane note={note}></RibbonLane>
        {/each}
    </div>
</div>

<style>
    #ribbon-panel {
        display: flex;
        max-width: 100vw;
        justify-content: center;
        align-items: flex-end;
        grid-area: main-panel;
    }

    .lane-container {
        max-width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
    }
</style>