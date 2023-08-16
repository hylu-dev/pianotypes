import { Reverb, Soundfont } from "smplr";

export default function getSoundFont(instrument) {
    const ac = new AudioContext();
    const soundfont = new Soundfont(ac, {
        instrument: instrument
    });
    soundfont.output.addEffect("reverb", new Reverb(ac), .2);
    soundfont.output.setVolume(127);
    return soundfont
}