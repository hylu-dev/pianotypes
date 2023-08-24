# Piano Types

![pianotypes-demo](https://github.com/hylu-dev/pianotypes/blob/master/pianotypes-demo.gif)

A virtual piano that provides a full-range, customizable piano. The piano can be played either using your mouse or with your keyboard.
This serves to replace <https://github.com/hylu-dev/pianotypes_old>.

The project is currently hosted on <https://pianotypes.netlify.app/> and is a work in progress.

## Features

- Visual display of piano key presses
- Multiple instrument sounds from [smplr](https://github.com/danigb/smplr)
- Adjustable key bind positioning and piano size
- Split hotkey bindings to play across a larger range
- Midi playback through [MidiPlayerJS](https://github.com/grimmdude/MidiPlayerJS) with media controls
  - Midi input is fed into piano in real-time
- [magenta.js](https://github.com/magenta/magenta-js) music generation via midi
  - Includes improved scheduled midi playback at the cost of real-time input
  - Tunable parameters for music generation

## Controls

App is largely interactable through mouse. The following are keyboard hotkeys.

> **Note** that due to variable key rollover, most keyboards will be limited to registering a fixed amount of simultaneous key presses. Look into keyboards with *n-key rollover* to bypass this limitation.


- **Tab**: Open top widget panel.
- **Keyboard**: to press the corresponding keys on the piano.
- **Space**: initiates the sutain pedal.
- **Shift**: initiates the soft pedal.
- **←→ arrow keys**: move the keybindings across the piano one key at a time.
- **↓↑ arrow keys**: adds and removes keys to the piano range.
- **Control**: modifier can be used with pedals to lock them as well as manipulate keys by octaves instead of semitones

## Roadmap

- Replace Ribbon Visualizer DOM elements with faster Canvas2D
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
