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
    if (!genie) {
        genie = new mm.PianoGenie(GENIE_CHECKPOINT);
        genie.initialize().then(() => {
            ready = true;
        });
    } else {
        ready = true;
    }
    
}

function disableGenie() {
    ready = false;
}
</script>

{#if mm}
<div class="flex-col">
    <div class="flex-row">
        <h3>piano genie</h3>
    </div>
    <div class="flex-row">
        {#if !ready}
        <button on:click={startGenie}>Enable</button>
        {:else}
        <button class="disabled" on:click={disableGenie}>Disable</button>
        {/if}
        
    </div>
</div>
{/if}

<style>
    .disabled {
        background-color: #441111;
    }
</style>