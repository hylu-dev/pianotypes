<script>
export let max = 1;
export let min = 0;
export let initial = 0;

let dragDist = 1000;
let value = initial;
let startPos = 0;
let isDragging = false;

function trackValue(e) {
    if (isDragging) {
        let increment = ((e.clientY - startPos)/dragDist);
        let delta = value - increment;
        if (delta < min) {
            //value = min;
        } else if (delta > max) {
            value = max;
        } else {
            value = delta;
        }
        
    }
}

function handleMouseDown(e) {
    isDragging = true;
    startPos = e.clientY
}

function handleMouseUp(e) {
    isDragging = false;
}
</script>

<svelte:window on:mousemove={trackValue} on:mouseup={handleMouseUp}/>
<input
draggable="true"
on:dragstart={handleMouseDown}
bind:value={value}
type="number">

<style>
    input[type='number'] {
        cursor: n-resize;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
}
</style>