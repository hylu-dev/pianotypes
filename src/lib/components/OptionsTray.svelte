<script>
import PianoController from "./widgets/PianoController.svelte";
import HotkeyController from "./widgets/HotkeyController.svelte";
import PianoPedal from "./widgets/PianoPedal.svelte";
import MidiPlayer from "./widgets/MidiPlayer.svelte";
import MidiGenerator from "./widgets/MidiGenerator.svelte";

let hidden = true;

function toggleTray(e) {
    if (e.key === 'Tab') {
        hidden = !hidden
    }
}

</script> 

<svelte:window on:keydown={toggleTray}/>
<div id="options-tray" class:hidden>
    <div id="options-wrapper">
        <div class="options-block">
            <PianoPedal></PianoPedal>
        </div>
        <div class="options-block">
            <PianoController></PianoController>
        </div>
        <div class="options-block">
            <HotkeyController></HotkeyController>
        </div>
        <div class="options-block">
            <MidiPlayer></MidiPlayer>
        </div>
        <div class="options-block">
            <MidiGenerator></MidiGenerator>
        </div>
    </div>
    <button id="pull-tab" on:click={() => hidden = !hidden}>
        {#if hidden}
            <span>&#9207</span>
        {:else}
            <span>&#9206</span>
        {/if}
    </button>
</div>

<style>
    #options-tray {
        max-width: 100vw;
        position: relative;
        display: flex;
        justify-content: center;
        align-self: top;
        max-height: 160px;
        grid-area: main-panel;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #options-wrapper {
        max-width: 100%;
        height: 100%;
        display: flex;
        background-color: rgba(33, 33, 33, .5);
        color: var(--text-dark);
        z-index: 2;
        gap: 1ch;
        padding: 1ch;
        box-sizing: border-box;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
        border-radius: 0 0 .5rem .5rem;
        flex-flow: row nowrap;
        overflow-x: auto;
    }

    .options-block {
        display: flex;
        justify-content: center;
        height: 100%;
        background-color: var(--bg-darkest);
        padding: 1rem;
        box-sizing: border-box;
        border-radius: .5rem;
        gap: 1rem;
    }

    .hidden {
        margin-top: -160px;
    }

    #pull-tab {
        user-select: none;
        opacity: 1;
        position: absolute;
        width: 50px;
        height: 25px;
        background-color: var(--bg-dark);
        border-radius: 0 0 50px 50px;
        border: none;
        bottom: -25px;
        left: calc(50% - 25px);
        z-index: 5;
        color: var(--text-grey);
        font-size: 1.5rem;
        font-size: 2rem;
        padding-bottom: .8rem;
        line-height: 0px;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #pull-tab:hover {
        background-color: var(--bg-grey);
        color: var(--text-gold);
        transform: scaleX(1.1);
    }
</style>