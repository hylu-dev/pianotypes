<script>
import OptionsBlock from "./OptionsBlock.svelte";
import PianoController from "./widgets/PianoController.svelte";
import HotkeyController from "./widgets/HotkeyController.svelte";
import PianoPedal from "./widgets/PianoPedal.svelte";
import MidiPlayer from "./widgets/MidiPlayer.svelte";
import MidiGenerator from "./widgets/MidiGenerator.svelte";

let hideTray = true;

function toggleTray(e) {
    if (e.key === 'Tab') {
        hideTray = !hideTray
    }
}

</script> 

<svelte:window on:keydown={toggleTray}/>
<div id="options-tray" class:hideTray>
    <div id="options-wrapper">
        <OptionsBlock>
            <PianoPedal slot="content"></PianoPedal>
            <div slot="info">
                <p>
                    piano pedalling
                </p>
                <ul>
                     <li><b>sustain pedal</b> <em>space</em>: holds the duration of played notes</li>
                     <li><b>sostenuto pedal</b> <em>rshift</em>: unimplemented</li>
                     <li><b>soft pedal</b> <em>lshift</em>: softens velocity of played notes</li>   
                </ul>
            </div>
        </OptionsBlock>
        <OptionsBlock>
            <PianoController slot="content"></PianoController>
            <div slot="info">
                <p>
                    control piano sound and range
                </p>
                <ul>
                     <li><b>instrument</b>: instrument selection from soundfont</li>
                     <li><b>volume</b>: loudness of piano </li>   
                     <li><b>velocity</b>: how hard notes are played. Can effect quality of sound in addition to loudness</li>
                     <li><b>reverb</b>: sound decay</li>   
                     <li><b>range</b> <em>up/down</em>: Lowest and highest notes in piano range</li>   
                </ul>
            </div>
        </OptionsBlock>
        <OptionsBlock>
            <HotkeyController slot="content"></HotkeyController>
            <div slot="info">
                <p>
                    control hotkey arrangement
                </p>
                <ul>
                     <li><b>hotkeys</b>: whether hotkeys are visible</li>
                     <li><b>guides</b>: darkens unbound notes, highlights hotkeys bound to upper rows of keyboard keys </li>   
                     <li><b>base</b> <em>left/right</em>: the lowest note hotkeys are bound from</li>
                     <li><b>split</b>: semitone gap for split mode</li>   
                     <li><b>normal mode</b>: binds keys by row on keyboard</li>   
                     <li><b>split mode</b>: binds keys by with left hand on left side of keyboard and right hands on right sde</li>   
                </ul>
            </div>
        </OptionsBlock>
        <OptionsBlock>
            <MidiPlayer slot="content"></MidiPlayer>
            <div slot="info">
                <p>
                    <b>midi playback</b> by directing midi events to the piano in real-time
                </p>
                <ul>
                    <li>instrument changes and pedalling apply in real-time</li>
                    <li>user can play along during playback</li>
                    <li>full media controls</li>
                    <li>may have timing issues for many midi events</li>
                </ul>
            </div>
        </OptionsBlock>
        <OptionsBlock --info-size="250px">
            <MidiGenerator slot="content"></MidiGenerator>
            <div slot="info">
                <p style="color:darkred"><b>WARNING WIP:</b> BROWSER WILL FREEZE DURING GENERATION</p>
                <p style="color:darkred"><b>WARNING WIP:</b> CHROMIUM BROWSERS WILL HAVE PLAYBACK ISSUES FOR LONG MIDIS. CONSIDER TRIMMING</p>
                <p>
                    ai music generation using a given midi file. also includes scheduled midi playback
                </p>
                <ul>
                    <li><b>midi playback</b>: uses web audio scheduling for better timing but the following caveats</li>
                    <ul>
                        <li>does not allow real-time influencing like pedalling or instrument changes</li>
                        <li>user playing may interfere playback</li>
                        <li>large midi files may overload web audio</li>
                    </ul>
                    <li><b>trim</b>: truncate midi length for both playback and generation</li>
                    <li><b>steps</b>: affects the amount of generated music</li>
                    <li><b>temperature</b>: introduces randomness to music generation</li>
                    <li><b>generate</b>: generates and plays music from supplied midi</li>
               </ul>
            </div>
        </OptionsBlock>
    </div>
    <button id="pull-tab" on:click={() => hideTray = !hideTray}>
        {#if hideTray}
            <span>&#9207</span>
        {:else}
            <span>&#9206</span>
        {/if}
    </button>
</div>

<style>
    #options-tray {
        max-width: 100vw;
        position: relative;
        display: flex;
        justify-content: center;
        align-self: top;
        max-height: 180px;
        grid-area: main-panel;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #options-wrapper {
        max-width: 100%;
        height: 100%;
        display: flex;
        background-color: rgba(33, 33, 33, .5);
        color: var(--text-dark);
        z-index: 2;
        gap: 1ch;
        padding: 1ch;
        box-sizing: border-box;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
        border-radius: 0 0 .5rem .5rem;
        flex-flow: row nowrap;
        overflow-x: auto;
    }

    .hideTray {
        margin-top: -180px;
    }

    #pull-tab {
        user-select: none;
        opacity: 1;
        position: absolute;
        width: 50px;
        height: 25px;
        background-color: var(--bg-dark);
        border-radius: 0 0 50px 50px;
        border: none;
        bottom: -25px;
        left: calc(50% - 25px);
        z-index: 5;
        color: var(--text-grey);
        font-size: 1.5rem;
        font-size: 2rem;
        padding-bottom: .8rem;
        line-height: 0px;
        transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #pull-tab:hover {
        background-color: var(--bg-grey);
        color: var(--text-gold);
        transform: scaleX(1.1);
    }
</style>