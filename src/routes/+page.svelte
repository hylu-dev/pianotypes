<script>
    import PianoKeyboard from '$lib/components/piano/PianoKeyboard.svelte'
    import RibbonPanel from '$lib/components/ribbon/RibbonPanel.svelte'
    import NoteDisplay from '$lib/components/NoteDisplay.svelte'
    import OptionsPanel from '../lib/components/OptionsPanel.svelte';
</script>

<div class="grid-container">
    <!-- <tabs id="tabs">
    <div class="icon-filled-panel"></div>
    <div class="icon-ribbon-panel-invert"></div>
    <div class="icon-typing-panel-invert"></div>
    </tabs> -->
    <RibbonPanel></RibbonPanel>
    <OptionsPanel></OptionsPanel>
    <NoteDisplay></NoteDisplay>
    <PianoKeyboard></PianoKeyboard>
    <!-- <note-display v-if="renderDisplay" id="note-display"></note-display>
    <piano-pedal v-if="renderPedal" id="piano-pedal"></piano-pedal>
    <piano-controller v-if="renderController" id="piano-controller"></piano-controller> -->
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

/* .icon-filled-panel:hover, .icon-ribbon-panel-invert:hover, .icon-typing-panel-invert:hover {
    filter: brightness(1.1);
    transform: scale(1.1);
} */

#tabs {
    grid-area: main-panel;
    place-self: start right;
}

#piano-pedal {
    grid-area: piano-left;
    background: var(--secondary-bg-colour);
}

#piano-controller {
    grid-area: piano-right;
    background: var(--secondary-bg-colour);
}
</style>