<script>
    let showInfo = false;
</script>

<div class="options-block">
    <div class="content" class:hidden={showInfo}>
        <slot name="content">
            <div style="font-size: 5rem;">&#63;</div>
        </slot>
    </div>
    <div class="info" class:hidden={!showInfo}>
        <slot name="info">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe eius quaerat voluptatibus perferendis ad facilis id, nesciunt aperiam ex illum beatae fugiat aspernatur expedita, eaque ipsum dolore et. Quidem, earum?
        </slot>
    </div>
    <button on:click={() => showInfo = !showInfo}>&#63;</button>
</div>

<style>
    .hidden {
        display: none;
    }

    .info {
        width: var(--info-size, 180px);;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-color: var(--bg-dark-grey);
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
        color: var(--text-dark-grey);
    }

    button:hover {
        color: var(--text-light);
    }
</style>