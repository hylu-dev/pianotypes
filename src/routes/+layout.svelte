<div class="vertical-flex-container">
    <nav>
        <div class="author-links">

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
</div>


<style>
.vertical-flex-container {
    display: flex;
    flex-flow: column;
    height: 100vh;
}

.vertical-flex-child {
    flex: 1 0 auto;
}

nav {
    display: flex;
    background: var(--bg-grey);
    border: none;
    width: 100%;
    height: 60px;
    font-size: 1rem;
    justify-content: space-around;
    align-items: center; /* align vertical */
    box-shadow: 0 0 10px black;
    user-select: none;
    padding: 5px;
    line-height: 0;
    z-index: 3;
}

nav h1 {
    align-self: center;
    font-size: 1.7rem;
}

nav h1:focus {
    outline: 4px solid var(--text-gold);
}

.author-links {
    display: flex;
}

.menu-container {
    display: flex;
    justify-content: flex-end;
    font-size: 2rem;
    gap: 1rem;
}
</style>

