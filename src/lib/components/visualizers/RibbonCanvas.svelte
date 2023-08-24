<script>
import { onMount } from 'svelte';

let canvas;

onMount(() => {
    const ctx = canvas.getContext('2d');

    function draw () {
        const frame = requestAnimationFrame(draw);
    }
});


</script>

<canvas bind:this={canvas} id="canvas" width="300" height="300"></canvas>

<style>

    #canvas {
        grid-area: main-panel;
    }
    
</style>