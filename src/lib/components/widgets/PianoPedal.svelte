<script>
import piano from '$lib/stores/PianoStore'
import { inputFocused } from '$lib/stores/GlobalStore'

function pressPedal(e) {
    if (inputFocused) return;
    // Sustain
    if (e.key === ' ') { 
        $piano.setSustainPedal(true);
    }
    // Sostenuto
    if (e.code === 'ShiftRight') { 
        $piano.setSostenutoPedal(true);
    }
    // Soft
    if (e.code === "ShiftLeft") { 
        $piano.setSoftPedal(true);
    }
}

function liftPedal(e) {
    if (inputFocused) return;
    // Sustain
    if (e.key == ' ' && !e.ctrlKey) {
        $piano.setSustainPedal(false);
    }
    // Sostenuto
    if (e.code === 'ShiftRight' && !e.ctrlKey) { 
        $piano.setSostenutoPedal(false);
    }
    // Soft
    if (e.key == "Shift" && !e.ctrlKey) {
        $piano.setSoftPedal(false);
    }
}
</script>

<svelte:window on:keydown={pressPedal} on:keyup={liftPedal}/>
<div class="pedal-container">
    <div class="pedal-box">
        <div class="icon-soft-pedal" class:pressed={$piano.softPedal} on:click={() => $piano.setSoftPedal()} role="none"></div>
        <div class="icon-sostenuto-pedal" class:pressed={$piano.sostenutoPedal} on:click={() => $piano.setSostenutoPedal()} role="none"></div>
        <div class="icon-sustain-pedal" class:pressed={$piano.sustainPedal} on:click={() => $piano.setSustainPedal()} role="none"></div>
    </div>
</div>

<style>
    .pedal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 10px;
        user-select: none;
    }

    .pedal-box {
        display: flex;  
        flex-flow: row;
        align-items: flex-start;
        gap: .5rem;
        height: 3rem;
        border-radius: 5%;
        box-sizing: border-box;
        background: var(--bg-dark-grey);
    }

    .icon-soft-pedal, .icon-sostenuto-pedal, .icon-sustain-pedal {
        font-size: 5rem;
        color: var(--text-grey);
        transform: scaleY(.5);
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .icon-soft-pedal:hover, .icon-sostenuto-pedal:hover, .icon-sustain-pedal:hover {
        filter: brightness(1.3);
        transform: scaleY(.46);
    }

    .icon-soft-pedal:active, .icon-sostenuto-pedal:active, .icon-sustain-pedal:active {
        filter: brightness(1);
        transform: scaleY(.46)translateY(7px);
    }

    .pressed {
        color: var(--text-gold);
        transform: scaleY(.46)translateY(7px);
    }

    .pressed:hover {
        color: var(--text-gold);
        transform: scaleY(.46)translateY(7px);
    }
</style>