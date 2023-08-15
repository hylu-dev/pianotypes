<script>
	import { slide } from "svelte/transition";
import PianoController from "./piano/PianoController.svelte";
import PianoPedal from "./piano/PianoPedal.svelte";


let hidden = true;

function toggleTray(e) {
    if (e.key === 'Tab') {
        hidden = !hidden
    }
}

function htmlEntity(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
    .hidden {
        margin-top: -160px;
    }

    #pull-tab {
        user-select: none;
        opacity: 1;
        position: absolute;
        width: 50px;
        height: 25px;
        background-color: var(--bg-darker);
        border-radius: 0 0 50px 50px;
        border: none;
        bottom: -25px;
        left: calc(50% - 25px);
        z-index: 5;
        color: var(--bg-grey);
        font-size: 1.5rem;
        font-size: 2rem;
        padding-bottom: .5rem;
        line-height: 0px;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #pull-tab:hover {
        background-color: var(--bg-grey);
        color: var(--text-gold);
        transform: scaleX(1.1);
    }

    #options-tray {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        align-self: top;
        height: 160px;
        grid-area: main-panel;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #options-wrapper {
        height: 100%;
        display: flex;
        justify-content: center;
        background-color: rgba(33, 33, 33, .9);
        color: var(--text-dark);
        z-index: 2;
        gap: 1rem;
        padding: 1rem;
        box-sizing: border-box;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .options-block {
        display: flex;
        justify-content: center;
        height: 100%;
        background-color: var(--bg-darker);
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 5%;
    }
</style>