<script>
import PianoController from "./piano/PianoController.svelte";
import PianoPedal from "./piano/PianoPedal.svelte";
</script>   

<div id="options-panel">
    <div class="options-block">
        <PianoPedal></PianoPedal>
    </div>
    <div class="options-block">
        <PianoController></PianoController>
    </div>
</div>

<style>
    #options-panel {
        display: flex;
        justify-content: center;
        align-self: top;
        max-height: 200px;
        background-color: rgba(33, 33, 33, .3);
        color: var(--tertiary-text-colour);
        grid-area: main-panel;
        z-index: 2;
        gap: 1rem;
        padding: 1rem;
        box-sizing: border-box;
    }

    .options-block {
        display: flex;
        justify-content: center;
        height: 100%;
        background-color: #111;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 5%;
    }
</style>