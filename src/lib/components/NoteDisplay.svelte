<template>
    <transition name="slide-fade">
        <div :key="currentNote">{{ currentNote }}</div>
    </transition>
</template>

<script>
import PianoStateStore from '@/stores/PianoStateStore'

export default {
    name: 'note-display',
    data() {
        return {
            sharedKeyboard: PianoStateStore.state.keyboard
        }
    },
    computed: {
        currentNote: function() {
            return this.sharedKeyboard.getLastKey();
        }
    }
}
</script>   

<style>
    #note-display {
        display: grid;
        place-items: center center;
        font-size: min(10rem, 12vw);
        user-select: none;
        color: var(--tertiary-text-colour);
    }
    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: all .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .slide-fade-enter, .slide-fade-leave-to
    {
        opacity: 0;
        transform: scale(1.1);
    }
</style>