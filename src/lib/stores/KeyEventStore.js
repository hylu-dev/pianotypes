import { writable } from 'svelte/store';

const keyEvent = writable({});

export const setKeyEvent = (note, x, y, width, height) => {
    keyEvent.set({
        'note': note,
        'x': x,
        'y': y,
        'width': width,
        'height': height,
        'on': true
    })
}

export default keyEvent;