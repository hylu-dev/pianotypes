import { writable } from 'svelte/store';

export const inputFocused = writable(false);
export const toastMessage = writable("");