<script>
    import { fly } from 'svelte/transition';
    import { toastMessage } from '$lib/stores/GlobalStore'
    import { writable } from 'svelte/store';

    let show = writable(false);
    let timeoutId = 0;

    $: {
        if ($toastMessage) {
            console.log(`Message: ${$toastMessage}`);
            clearTimeout(timeoutId);
            show.set(true);
        }
        timeoutId = setTimeout(() => {
            show.set(false);
        }, delay(2500));
    }

    function delay(millis) {
        return Math.max(
            millis, Math.min(
                millis*($toastMessage.length/15), 8000
                )
            );
    }
</script>

{#if $show}
<div id="toast"
transition:fly={{ delay: 0, duration: 1000, x: 0, y: 100, opacity: 0 }}>
    <span>{$toastMessage}</span>
</div>
{/if}

<style>
    #toast {
        display: block;
        max-width: 400px;
        width: fit-content;
        position: fixed;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        bottom: 20%;
        opacity: .9;
        background-color: var(--bg-grey);
        border-radius: 25px;
        padding: 1rem;
        z-index: 3;
    }
</style>