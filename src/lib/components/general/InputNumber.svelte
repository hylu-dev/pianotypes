<script>
import { inputFocused } from '$lib/stores/GlobalStore'
import { createEventDispatcher } from 'svelte';

export let id = '';
export let max = 10;
export let min = 0;
export let step = 1;
export let inputValue = 0;

const dispatch = createEventDispatcher();

let decimals = countDecimals(step);
let valueAtClick = inputValue;
let startMousePos = [0, 0];
let isDragging = false;

// https://stackoverflow.com/questions/17369098/simplest-way-of-getting-the-number-of-decimals-in-a-number-in-javascript
function countDecimals(value) {
    if (~~value !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

// References https://codepen.io/DarkStar66/pen/eBrdrY
function trackValue(e) {
    if (isDragging) {
        const distX = e.clientX - startMousePos[0];
        const distY = startMousePos[1]-e.clientY;
        const dist = ~~(distX+distY);

        let increment = step*dist/10;
        let value = valueAtClick + increment;
        value = parseFloat(value.toFixed(decimals))
        if (value < min) value = min;
        else if (value > max) value = max;
        inputValue = value;
        dispatch('change', inputValue)
    }
}

function resetIfNaN() {
    if (!Number.isFinite(parseInt(inputValue))) {
        inputValue = valueAtClick;
        dispatch('change', inputValue)
    }
}

function handleMouseDown(e) {
    startMousePos = [e.clientX, e.clientY];
    isDragging = true;
    valueAtClick = !Number.isFinite(valueAtClick) ? 0 : inputValue;
}

function handleMouseUp(e) {
    isDragging = false;
    resetIfNaN();
}

function handleChange(e) {
    let value = e.target.value;
    if (value > max) value = max;
    else if (value < min) value = min;
    dispatch('change', value);
}

function keyBlur(e) {
    if (e.key === "Enter") {
        e.target.blur();
    }
}

</script>

<svelte:window on:mousemove={trackValue} on:mouseup={handleMouseUp}/>
<input
id={id}
min={min}
max={max}
step={step}
draggable="true"
on:change={handleChange}
on:mousedown={handleMouseDown}
on:blur={() => resetIfNaN()}
on:focusin={() => inputFocused.set(true)}
on:focusout={() => inputFocused.set(false)}
on:keypress={keyBlur}
bind:value={inputValue}
pattern="[0-9]+"
type="number">

<style>
    input[type='number'] {
        cursor: n-resize;
        width: var(--width, 6ch);
        height: var(--height, 2ch);
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