import * as Tone from 'tone';

/**
 * Professional synth presets for VibePod
 * Architecture: AI specifies instrument TYPE, we apply high-quality PRESETS
 */

export const SYNTH_PRESETS: Record<string, Record<string, any>> = {
    drums: {
        MembraneSynth: {
            pitchDecay: 0.02,
            octaves: 4,
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 0.1
            }
        },
        NoiseSynth: {
            noise: { type: 'white' },
            envelope: {
                attack: 0.001,
                decay: 0.2,
                sustain: 0
            }
        },
        MetalSynth: {
            frequency: 200,
            envelope: { attack: 0.001, decay: 0.4, release: 0.1 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }
    },

    bass: {
        MonoSynth: {
            oscillator: { type: 'square' as Tone.ToneOscillatorType },
            filter: {
                Q: 2,
                type: 'lowpass' as BiquadFilterType,
                rolloff: -24
            },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.3,
                release: 0.4
            },
            filterEnvelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.3,
                release: 0.4,
                baseFrequency: 100,
                octaves: 2.5
            }
        },
        FMSynth: {
            harmonicity: 3,
            modulationIndex: 10,
            oscillator: { type: 'sine' as Tone.ToneOscillatorType },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.3,
                release: 0.6
            },
            modulation: { type: 'square' as Tone.ToneOscillatorType },
            modulationEnvelope: {
                attack: 0.01,
                decay: 0.3,
                sustain: 0.2,
                release: 0.4
            }
        },
        AMSynth: {
            harmonicity: 2,
            oscillator: { type: 'fatsawtooth' as Tone.ToneOscillatorType },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.4,
                release: 0.5
            },
            modulation: { type: 'square' as Tone.ToneOscillatorType },
            modulationEnvelope: {
                attack: 0.5,
                decay: 0.2,
                sustain: 0.8,
                release: 0.5
            }
        }
    },

    melody: {
        Synth: {
            oscillator: { type: 'sawtooth' as Tone.ToneOscillatorType },
            envelope: {
                attack: 0.02,
                decay: 0.2,
                sustain: 0.4,
                release: 0.8
            }
        },
        PluckSynth: {
            attackNoise: 1,
            dampening: 4000,
            resonance: 0.9
        },
        DuoSynth: {
            vibratoAmount: 0.2,
            vibratoRate: 3,
            harmonicity: 1.5,
            voice0: {
                oscillator: { type: 'sawtooth' as Tone.ToneOscillatorType },
                envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }
            },
            voice1: {
                oscillator: { type: 'sine' as Tone.ToneOscillatorType },
                envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }
            }
        },
        FMSynth: {
            harmonicity: 8,
            modulationIndex: 2,
            oscillator: { type: 'sine' as Tone.ToneOscillatorType },
            envelope: { attack: 0.02, decay: 0.3, sustain: 0.5, release: 1.2 },
            modulation: { type: 'square' as Tone.ToneOscillatorType }
        }
    },

    pad: {
        Synth: {
            oscillator: { type: 'fatsawtooth' as Tone.ToneOscillatorType },
            envelope: {
                attack: 0.5,
                decay: 0.3,
                sustain: 0.8,
                release: 2.0
            }
        },
        AMSynth: {
            harmonicity: 3,
            oscillator: { type: 'fatsawtooth' as Tone.ToneOscillatorType },
            envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 2.5 },
            modulation: { type: 'sine' as Tone.ToneOscillatorType },
            modulationEnvelope: { attack: 0.5, decay: 0.3, sustain: 0.7, release: 2.0 }
        },
        DuoSynth: {
            vibratoAmount: 0.5,
            vibratoRate: 5,
            harmonicity: 1.5,
            voice0: {
                oscillator: { type: 'sine' as Tone.ToneOscillatorType },
                envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 3.0 }
            },
            voice1: {
                oscillator: { type: 'triangle' as Tone.ToneOscillatorType },
                envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 3.0 }
            }
        }
    }
};

/**
 * Get the appropriate preset for a track
 * @param trackType - drums, bass, melody, pad
 * @param instrumentType - Synth, MonoSynth, etc.
 * @returns Preset object or undefined
 */
export function getPreset(trackType: string, instrumentType: string): any {
    return SYNTH_PRESETS[trackType]?.[instrumentType];
}
