<script>
    import '$lib/assets/app.css'
    import '$lib/assets/iconfonts/style.css'
    import Toast from '$lib/components/general/Toast.svelte';
    import Github from "$lib/assets/icons/github-mark.svg"
</script>

<div class="vertical-flex-container">
    <nav>
        <div class="author-links">
            <a href="https://github.com/hylu-dev/pianotypes" target="_blank"><img src={Github} alt="github"></a>
        </div>

        <div class="title-link">
            <h1>pianotypes</h1>
        </div>

        <div class="menu-container">
            
        </div>
    </nav>

    <div class="vertical-flex-child">
        <slot />
    </div>
    <Toast></Toast>
</div>


<style>

img {
    height: 1.5rem;
    fill: #BBAF6A;
    filter: saturate(0)brightness(.5);
    transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
}

img:hover {
    filter: saturate(1);
}

img:active {
    filter: brightness(.5)
}

.author-links {
    justify-content: flex-start;
}

.vertical-flex-container {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100vh;
    width: 100vw;
}

.vertical-flex-child {
    height: 100%;
    width: 100%;
}

nav {
    box-sizing: border-box;
    display: flex;
    background: var(--bg-dark-grey);
    border: none;
    width: 100%;
    height: 60px;
    font-size: 1rem;
    justify-content: space-around;
    align-items: center; /* align vertical */
    box-shadow: 0 0 10px 3px black;
    user-select: none;
    padding: 5px 20px;
    line-height: 0;
    z-index: 3;
}

nav > * {
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
}

nav h1 {
    align-self: center;
    font-size: 1.7rem;
}

nav h1:focus {
    outline: 4px solid var(--text-gold);
}
</style>

