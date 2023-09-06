<script>
import { onMount } from 'svelte';

let canvas;
let ctx;

/*
type Ribbon {
    x: number;
    y: number;
    width: number;
    height: number;
    released: boolean;
}
*/
let whiteRibbons = [
    {
        x: 50,
        y: 0,
        width: 50,
        height: 200,
        released: false
    }
];

let blackRibbons = [

];

const borderRadius = 4;
const ribbonSpeed = 2;

onMount(() => {
    fitToContainer(canvas);
    ctx = canvas.getContext('2d');
    draw();
});

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;

    for (let ribbon of whiteRibbons) {
        const xPos = ribbon.x;
        const yPos = canvas.height-ribbon.y-ribbon.height;
        ctx.fillStyle = "rgb(120, 200, 110)";
        ctx.beginPath();
        ctx.roundRect(
            xPos, yPos, ribbon.width, ribbon.height, borderRadius
        );
        ctx.fill();
        
        // Extend or flyout ribbon
        if (ribbon.released) {
            ribbon.y += ribbonSpeed;
        } else {
            ribbon.height += ribbonSpeed;
        }
        // Clear ribbon
        if (yPos+ribbon.height < 0) {
            whiteRibbons = [];
        }
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
        background-color: #222;
    }
</style>