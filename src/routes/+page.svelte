<script>
    import PianoKeyboard from '$lib/components/piano/PianoKeyboard.svelte'
    import RibbonPanel from '$lib/components/visualizers/ribbon/RibbonPanel.svelte'
    import NoteDisplay from '$lib/components/visualizers/NoteDisplay.svelte'
    import OptionsTray from '../lib/components/OptionsTray.svelte';

    function handleDefaults(e) {
        // override quickfind on firefox
        if ("'/".includes(e.key)) e.preventDefault();
        if(e.shiftKey) e.preventDefault();
        if (e.key === ' ') e.preventDefault();
        if (e.key === 'Tab') e.preventDefault();
    }
</script>

<svelte:window on:keydown={handleDefaults} on:dragstart={ e => e.preventDefault()}/>
<div class="grid-container">
    <!-- <tabs id="tabs">
    <div class="icon-filled-panel"></div>
    <div class="icon-ribbon-panel-invert"></div>
    <div class="icon-typing-panel-invert"></div>
    </tabs> -->
    <RibbonPanel></RibbonPanel>
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

.icon-filled-panel, .icon-ribbon-panel-invert, .icon-typing-panel-invert {
    font-size: 2rem;
    transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>