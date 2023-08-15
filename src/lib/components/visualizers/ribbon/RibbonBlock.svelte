<script>
import { createEventDispatcher } from 'svelte';
import { onMount } from 'svelte';

export let ribbonID;
export let isWhiteKey;
export let released;

const dispatch = createEventDispatcher();

let ribbonAnimation = null;
let ribbonDuration = 3000; // millis
let minHeight = 10; // px to avoid too thin blocks
let ribbonExtend = [];
let ribbonRelease = [];
let active = true;
let finished = false;

let el = null;

function dispatchDestroy() {
    active = false;
    dispatch('destroy', ribbonID);
}

onMount(() => {
    
    ribbonExtend= [
                { transform: 'translateY(50%)scaleY(0)' },
                { transform: 'none' }
            ]
    ribbonAnimation = el.animate(ribbonExtend, ribbonDuration);
});

let ribbonHeight = () => {
    let currentHeight = el.getBoundingClientRect().bottom - el.getBoundingClientRect().y;
    return currentHeight < minHeight ? minHeight+'px' : currentHeight+'px';
}

function releaseRibbon() {
    ribbonRelease = [
                    { transform: 'none' },
                    { transform: `translateY(${-el.clientHeight}px)` }
                ];
    ribbonAnimation.oncancel = () => {
        let leaveAnim = el.animate(ribbonRelease, ribbonDuration);
        leaveAnim.onfinish = dispatchDestroy;
    };
    el.style.height = ribbonHeight();
    requestAnimationFrame(() => ribbonAnimation.cancel())
}

$: {
    if (released && !finished) {
        finished = true; // stop receiving key release updates
        ribbonAnimation.pause();
        releaseRibbon();
    } 
}
</script>

{#if active}
<div bind:this={el} class="ribbon-wrapper">
    <div class="ribbon-block"
        class:white-ribbon={isWhiteKey}
        class:black-ribbon={!isWhiteKey}
    ></div>
</div>
{/if}

<style scoped>
    .ribbon-block {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        box-shadow: 0 0 .3vw .1vw #111;
    }

    .ribbon-wrapper {
        position: absolute;
        width: 100%;
        height: calc(100% + 1rem);
        box-sizing: none;
        bottom: 0;
    }

    .white-ribbon {
        background-color: var(--white-key-active-colour);
    }

    .black-ribbon {
        background-color: var(--black-key-active-colour);
    }
</style>