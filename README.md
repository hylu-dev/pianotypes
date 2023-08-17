# Piano Types

## *Minimalist Online Piano*

A virtual piano that provides a full-range, customizable piano. The piano can be played either using your mouse or with your keyboard.
This serves to replace <https://github.com/hylu-dev/pianotypes>.

The project is currently hosted on <https://pianotypestwo.netlify.app/>.
An older demo can be viewed on <https://www.hylu.dev/projects.html#section2>.

## Features

- Visual display of piano key presses
- Multiple instrument sounds from [smplr](https://github.com/danigb/smplr)
- Adjustable key bind positioning and piano size
- Midi playback through [MidiPlayerJS](https://github.com/grimmdude/MidiPlayerJS)

## Controls

App is largely interactable through mouse. The following are keyboard hotkeys.

- **Tab**: Open top widget panel.
- **Keyboard**: to press the corresponding keys on the piano.
- **Space**: initiates the sutain pedal.
- **Shift**: initiates the soft pedal.
- **←→ arrow keys**: move the keybindings across the piano one key at a time.
- **↓↑ arrow keys**: adds and removes keys to the piano range.
- **Control**: modifier can be used with pedals to lock them as well as manipulate keys by octaves instead of semitones

## Roadmap

- Sostenuto Pedal
- Music Generation
- More Visualizers

---

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
