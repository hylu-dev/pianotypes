<script>
    import hotkey from '$lib/stores/HotkeyStore'
</script>

<div>
    <h2>Hotkeys</h2>
    <button on:click={() => $hotkey.toggleHotkeys()}>Hotkeys</button>
    <button on:click={() => $hotkey.toggleGuides()}>Guides</button>
</div>

<style>

</style>