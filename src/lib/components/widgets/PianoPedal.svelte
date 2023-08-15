<script>
import piano from '$lib/stores/PianoStore'

function downSustainPedal(e) {
    if (e.key == ' ') { 
        $piano.setSustainPedal(true);
    } else if (!e.keyCode) { //if not a keypress assume click
        $piano.sustainPedal ? $piano.setSustainPedal(false) : $piano.setSustainPedal(true);
    }
}

function liftSustainPedal(e) {
    if (e.key == ' ' && !e.ctrlKey) {
        $piano.setSustainPedal(false);
    }
}

function downSoftPedal(e) {
    if (e.key == "Shift") { 
        $piano.setSoftPedal(true);
    } else if (!e.keyCode) { //if not a keypress assume click
        $piano.softPedal ? $piano.setSoftPedal(false) : $piano.setSoftPedal(true);
    }
}

function liftSoftPedal(e) {
    if (e.key == "Shift" && !e.ctrlKey) {
        $piano.setSoftPedal(false);
    }
}
</script>


<svelte:window 
    on:keydown={downSustainPedal} 
    on:keyup={liftSustainPedal}
    on:keydown={downSoftPedal}
    on:keyup={liftSoftPedal}
    />
<div class="pedal-container">
    <div class="pedal-box">
        <div class="icon-soft-pedal" class:pressed={$piano.softPedal} on:click={downSoftPedal}></div>
        <div class="icon-sostenuto-pedal" class:pressed={$piano.sostenutoPedal}></div>
        <div class="icon-sustain-pedal" class:pressed={$piano.sustainPedal} on:click={downSustainPedal}></div>
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
        color: var(--text-dark);
        transform: scaleY(.5);
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .icon-soft-pedal:hover, .icon-sostenuto-pedal:hover, .icon-sustain-pedal:hover {
        filter: brightness(1.3);
        transform: scaleY(.46);
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