<script>
    let showInfo = false;
</script>

<svelte:window on:keydown={() => showInfo = false}/>
<div class="options-block">
    {#if !showInfo}
        <div class="content">
            <slot name="content">
                <div style="font-size: 5rem;">?</div>
            </slot>
        </div>
    {:else}
        <div class="info">
            <slot name="info">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe eius quaerat voluptatibus perferendis ad facilis id, nesciunt aperiam ex illum beatae fugiat aspernatur expedita, eaque ipsum dolore et. Quidem, earum?
            </slot>
        </div>
    {/if}
    <button on:click={() => showInfo = !showInfo}>&#63;</button>
</div>

<style>
    .info {
        width: var(--info-size, 180px);;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        font-size: .7rem;
        color: var(--text-light);
    }

    .options-block {
        position: relative;
        display: grid;
        place-content: center;
        height: 100%;
        background-color: var(--bg-darkest);
        padding: 1rem;
        box-sizing: border-box;
        border-radius: .5rem;
    }

    button {
        display: grid;
        place-content: center;
        position: absolute;
        background-color: transparent;
        border-radius: 50%;
        height: 1.5ch;
        width: 1.5ch;
        right: 1px;
        bottom: 1px;
    }

    button:hover {
        background-color: var(--bg-light);
    }
</style>