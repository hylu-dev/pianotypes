<script>
import { onMount } from 'svelte';
import keyEvent from '$lib/stores/KeyEventStore.js'

let canvas;
let ctx;
const borderRadius = 4;
const ribbonSpeed = 3;

/*
type Ribbon {
    x: number;
    y: number;
    width: number;
    height: number;
    released: boolean;
}
*/

let onRibbons = {
    'A': {
        'x': 50,
        'y': 0,
        'width': 50,
        'height': 0
    }
};

let offRibbons = [
    {
        x: 100,
        y: 0,
        width: 50,
        height: 200
    }
];

$: handleEvent($keyEvent);

function handleEvent(event) {
    if (Object.keys(event).length === 0) return
    if (event.on) {
        onRibbons[event.note] = {
            'x': event.x,
            'y': event.y,
            'width': event.width,
            'height': event.height
        }
    } else {
        offRibbons.push({
            'x': onRibbons[event.note].x,
            'y': onRibbons[event.note].y,
            'width': onRibbons[event.note].width,
            'height': onRibbons[event.note].height
        })
        delete onRibbons[event.note]
    }
}

onMount(() => {
    fitToContainer(canvas);
    ctx = canvas.getContext('2d');
    draw();
});

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.shadowColor = "black";
    //ctx.shadowBlur = 10;
    offRibbons = offRibbons.filter((r) => canvas.height-r.y > -r.height);

    for (let ribbon of Object.values(onRibbons)) {
        const xPos = ribbon.x;
        const yPos = canvas.height-ribbon.y-ribbon.height;
        ctx.fillStyle = "rgb(120, 200, 110)";
        ctx.beginPath();
        ctx.roundRect(
            xPos, yPos, ribbon.width, ribbon.height, borderRadius
        );
        ctx.fill();
        ribbon.height += ribbonSpeed;
    }

    for (let ribbon of offRibbons) {
        const xPos = ribbon.x;
        const yPos = canvas.height-ribbon.y-ribbon.height;
        ctx.fillStyle = "rgb(120, 200, 110)";
        ctx.beginPath();
        ctx.roundRect(
            xPos, yPos, ribbon.width, ribbon.height, borderRadius
        );
        ctx.fill();
        
        ribbon.y += ribbonSpeed;
    }

    requestAnimationFrame(draw);
}

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
</script>

<div id="canvas">
    <canvas bind:this={canvas} width="300" height="300"></canvas>
</div>

<style>
    #canvas {
        box-sizing: border-box;
        grid-area: main-panel;
    }
</style>