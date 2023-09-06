<script>
import PianoKeyboard from '$lib/components/piano/PianoKeyboard.svelte'
import RibbonPanel from '$lib/components/visualizers/ribbon/RibbonPanel.svelte'
import NoteDisplay from '$lib/components/visualizers/NoteDisplay.svelte'
import OptionsTray from '$lib/components/OptionsTray.svelte';
import RibbonCanvas from '../lib/components/visualizers/RibbonCanvas.svelte';
import { inputFocused } from '$lib/stores/GlobalStore'

function handleDefaults(e) {
    // override quickfind on firefox
    if ("'/".includes(e.key)) e.preventDefault();
    if (e.shiftKey&&!$inputFocused) e.preventDefault();
    if (e.key === ' ') e.preventDefault();
    if (e.key === 'Tab') e.preventDefault();
}
</script>

<svelte:window
on:keydown={handleDefaults}
on:dragstart={ e => e.preventDefault()}
/>
<div class="grid-container">
    <!-- <RibbonPanel></RibbonPanel> -->
    <RibbonCanvas></RibbonCanvas>
    <OptionsTray></OptionsTray>
    <NoteDisplay></NoteDisplay>
    <PianoKeyboard></PianoKeyboard>
</div>
  
<style>
.grid-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: [row-start] 5fr var(--piano-height) [row-end];
    grid-template-areas: 
    "main-panel"
    "piano";
}
</style>