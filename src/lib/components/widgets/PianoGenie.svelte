<script>
import piano from '$lib/stores/PianoStore'
import { onMount } from 'svelte'
import { toastMessage } from '$lib/stores/GlobalStore'

let mm;
let genie;
let ready = false;

const GENIE_CHECKPOINT = 'https://storage.googleapis.com/magentadata/js/checkpoints/piano_genie/model/epiano/stp_iq_auto_contour_dt_166006';


onMount(() => {
    // Hacky way to get magentajs through cdn since I can't import it as an esModule :/
    mm = window.mm 
})

function startGenie() {
    genie = new mm.PianoGenie(GENIE_CHECKPOINT);
    genie.initialize().then(() => {
        ready = true;
    });
}
</script>

{#if mm}
<div class="flex-col">
    <div class="flex-row">
        <h3>piano genie</h3>
    </div>
    <div class="flex-row">
        <button on:click={startGenie}>Enable</button>
    </div>
</div>
{/if}

<style>
    .hanging:active {
        filter: invert(1);
    }

    .half-col {
        width: 50%;
    }

    .flex-col {
        max-width: 150px;
        gap: 0.4rem;
    }

    .flex-row {
        justify-content: center;
    }

    .disabled {
        pointer-events: none;
        filter: brightness(.4);
    }

    .file-input {
        background: var(--bg-dark);
        color: var(--text-grey);
        border-radius: 2px;
        font-family: 'Source Code Pro', Helvetica, Arial, sans-serif;
        border: solid 2px var(--bg-light);
        text-align: center;
        padding: .8ch;
        font-size: .5rem;
        box-sizing: border-box;
        width: 100%;
        white-space: nowrap;
        text-align: center;
        overflow:hidden;
    }

    .file-input:hover {
        background: var(--bg-grey);
        color: var(--text-gold);
    }
</style>