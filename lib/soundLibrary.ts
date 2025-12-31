export interface SoundPreset {
    id: string;
    name: string;
    category: string;
    subcategory?: string;
    instrumentType: string;
    trackType: string;
    previewNote?: string;
    previewDuration?: string;
    settings: any;
}

export const SOUND_LIBRARY: Record<string, SoundPreset[]> = {
    'Drums': [
        // Kicks
        {
            id: 'kick-808',
            name: '808 Kick',
            category: 'Drums',
            subcategory: 'Kick',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'C1',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.05,
                octaves: 10,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
            }
        },
        {
            id: 'kick-sub',
            name: 'Sub Kick',
            category: 'Drums',
            subcategory: 'Kick',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'C1',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.02,
                octaves: 4,
                envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.5 }
            }
        },
        {
            id: 'kick-tight',
            name: 'Tight Kick',
            category: 'Drums',
            subcategory: 'Kick',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'C1',
            previewDuration: '16n',
            settings: {
                pitchDecay: 0.008,
                octaves: 2,
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
            }
        },
        {
            id: 'kick-punchy',
            name: 'Punchy Kick',
            category: 'Drums',
            subcategory: 'Kick',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'C1',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.03,
                octaves: 6,
                envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }
            }
        },
        {
            id: 'kick-dance',
            name: 'Dance Kick',
            category: 'Drums',
            subcategory: 'Kick',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'C1',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.06,
                octaves: 8,
                envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 1.0 }
            }
        },
        // Snares
        {
            id: 'snare-bright',
            name: 'Bright Snare',
            category: 'Drums',
            subcategory: 'Snare',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C2',
            previewDuration: '16n',
            settings: {
                noise: { type: 'white' },
                envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
            }
        },
        {
            id: 'snare-deep',
            name: 'Deep Snare',
            category: 'Drums',
            subcategory: 'Snare',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C2',
            previewDuration: '8n',
            settings: {
                noise: { type: 'brown' },
                envelope: { attack: 0.001, decay: 0.3, sustain: 0 }
            }
        },
        {
            id: 'snare-electronic',
            name: 'Electronic Snare',
            category: 'Drums',
            subcategory: 'Snare',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C2',
            previewDuration: '16n',
            settings: {
                noise: { type: 'white' },
                envelope: { attack: 0.001, decay: 0.12, sustain: 0 }
            }
        },
        // Hi-Hats
        {
            id: 'hihat-closed',
            name: 'Closed Hat',
            category: 'Drums',
            subcategory: 'Hi-Hat',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '32n',
            settings: {
                frequency: 200,
                envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5
            }
        },
        {
            id: 'hihat-open',
            name: 'Open Hat',
            category: 'Drums',
            subcategory: 'Hi-Hat',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '8n',
            settings: {
                frequency: 200,
                envelope: { attack: 0.001, decay: 0.3, release: 0.3 },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5
            }
        },
        {
            id: 'hihat-vintage',
            name: 'Vintage Hat',
            category: 'Drums',
            subcategory: 'Hi-Hat',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '32n',
            settings: {
                frequency: 180,
                envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
                harmonicity: 4.5,
                modulationIndex: 28,
                resonance: 3500,
                octaves: 1.2
            }
        },
        // Claps
        {
            id: 'clap-tight',
            name: 'Clap',
            category: 'Drums',
            subcategory: 'Clap',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C2',
            previewDuration: '16n',
            settings: {
                noise: { type: 'pink' },
                envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
            }
        }
    ],

    'Bass': [
        {
            id: 'bass-sub',
            name: 'Sub Bass',
            category: 'Bass',
            subcategory: 'Sub',
            instrumentType: 'MonoSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '4n',
            settings: {
                oscillator: { type: 'sine' },
                filter: { Q: 1, type: 'lowpass', rolloff: -12 },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 },
                filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2, baseFrequency: 80, octaves: 1 }
            }
        },
        {
            id: 'bass-deep',
            name: 'Deep Sub',
            category: 'Bass',
            subcategory: 'Sub',
            instrumentType: 'MonoSynth',
            trackType: 'bass',
            previewNote: 'C1',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'sine' },
                filter: { Q: 0.5, type: 'lowpass', rolloff: -12 },
                envelope: { attack: 0.02, decay: 0.3, sustain: 0.7, release: 1.0 },
                filterEnvelope: { attack: 0.02, decay: 0.2, sustain: 0.2, release: 0.3, baseFrequency: 60, octaves: 0.5 }
            }
        },
        {
            id: 'bass-reese',
            name: 'Reese Bass',
            category: 'Bass',
            subcategory: 'Synth',
            instrumentType: 'MonoSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '4n',
            settings: {
                oscillator: { type: 'square' },
                filter: { Q: 2, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4 },
                filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4, baseFrequency: 100, octaves: 2.5 }
            }
        },
        {
            id: 'bass-fm',
            name: 'FM Bass',
            category: 'Bass',
            subcategory: 'Synth',
            instrumentType: 'FMSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '4n',
            settings: {
                harmonicity: 3,
                modulationIndex: 10,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.6 },
                modulation: { type: 'square' },
                modulationEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4 }
            }
        },
        {
            id: 'bass-wobble',
            name: 'Wobble Bass',
            category: 'Bass',
            subcategory: 'Synth',
            instrumentType: 'AMSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '2n',
            settings: {
                harmonicity: 2,
                oscillator: { type: 'fatsawtooth' },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 },
                modulation: { type: 'square' },
                modulationEnvelope: { attack: 0.5, decay: 0.2, sustain: 0.8, release: 0.5 }
            }
        },
        {
            id: 'bass-acid',
            name: 'Acid Bass',
            category: 'Bass',
            subcategory: 'Synth',
            instrumentType: 'MonoSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '8n',
            settings: {
                oscillator: { type: 'sawtooth' },
                filter: { Q: 6, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
                filterEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1, baseFrequency: 200, octaves: 5 }
            }
        },
        {
            id: 'bass-growl',
            name: 'Growl Bass',
            category: 'Bass',
            subcategory: 'Synth',
            instrumentType: 'FMSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '4n',
            settings: {
                harmonicity: 1,
                modulationIndex: 15,
                oscillator: { type: 'square' },
                envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
                modulation: { type: 'sawtooth' },
                modulationEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.5 }
            }
        },
        {
            id: 'bass-pluck',
            name: 'Pluck Bass',
            category: 'Bass',
            subcategory: 'Pluck',
            instrumentType: 'PluckSynth',
            trackType: 'bass',
            previewNote: 'C2',
            previewDuration: '8n',
            settings: {
                attackNoise: 1.5,
                dampening: 2000,
                resonance: 0.85
            }
        }
    ],

    'Synths': [
        {
            id: 'synth-lead',
            name: 'Lead Synth',
            category: 'Synths',
            subcategory: 'Lead',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '4n',
            settings: {
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.8 }
            }
        },
        {
            id: 'synth-supersaw',
            name: 'Supersaw',
            category: 'Synths',
            subcategory: 'Lead',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'fatsawtooth' },
                envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 1.0 }
            }
        },
        {
            id: 'synth-square-lead',
            name: 'Square Lead',
            category: 'Synths',
            subcategory: 'Lead',
            instrumentType: 'MonoSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '4n',
            settings: {
                oscillator: { type: 'square' },
                filter: { Q: 3, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.6 },
                filterEnvelope: { attack: 0.005, decay: 0.3, sustain: 0.3, release: 0.6, baseFrequency: 800, octaves: 3 }
            }
        },
        {
            id: 'synth-soft-lead',
            name: 'Soft Lead',
            category: 'Synths',
            subcategory: 'Lead',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '4n',
            settings: {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 1.0 }
            }
        },
        {
            id: 'synth-pluck',
            name: 'Pluck',
            category: 'Synths',
            subcategory: 'Pluck',
            instrumentType: 'PluckSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '8n',
            settings: {
                attackNoise: 1,
                dampening: 4000,
                resonance: 0.9
            }
        },
        {
            id: 'synth-bell',
            name: 'Bell',
            category: 'Synths',
            subcategory: 'Bell',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '4n',
            settings: {
                harmonicity: 8,
                modulationIndex: 2,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 1.5 },
                modulation: { type: 'square' }
            }
        },
        {
            id: 'synth-brass',
            name: 'Brass',
            category: 'Synths',
            subcategory: 'Brass',
            instrumentType: 'AMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 3,
                oscillator: { type: 'fatsawtooth' },
                envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 },
                modulation: { type: 'square' },
                modulationEnvelope: { attack: 0.2, decay: 0.2, sustain: 0.5, release: 0.5 }
            }
        },
        {
            id: 'synth-pad',
            name: 'Soft Pad',
            category: 'Synths',
            subcategory: 'Pad',
            instrumentType: 'Synth',
            trackType: 'pad',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'fatsawtooth' },
                envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2.0 }
            }
        },
        {
            id: 'synth-pad-warm',
            name: 'Warm Pad',
            category: 'Synths',
            subcategory: 'Pad',
            instrumentType: 'AMSynth',
            trackType: 'pad',
            previewNote: 'C3',
            previewDuration: '1n',
            settings: {
                harmonicity: 3,
                oscillator: { type: 'fatsawtooth' },
                envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 2.5 },
                modulation: { type: 'sine' },
                modulationEnvelope: { attack: 0.5, decay: 0.3, sustain: 0.7, release: 2.0 }
            }
        },
        {
            id: 'synth-keys',
            name: 'Electric Keys',
            category: 'Synths',
            subcategory: 'Keys',
            instrumentType: 'DuoSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '4n',
            settings: {
                vibratoAmount: 0.2,
                vibratoRate: 3,
                harmonicity: 1.5,
                voice0: {
                    oscillator: { type: 'sawtooth' },
                    envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }
                },
                voice1: {
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }
                }
            }
        },
        {
            id: 'synth-stab',
            name: 'Stab',
            category: 'Synths',
            subcategory: 'Stab',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '16n',
            settings: {
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
            }
        }
    ],

    'FX': [
        {
            id: 'fx-sweep',
            name: 'Sweep Up',
            category: 'FX',
            subcategory: 'Sweep',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C2',
            previewDuration: '1n',
            settings: {
                harmonicity: 0.5,
                modulationIndex: 20,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.01, decay: 1.0, sustain: 0, release: 0.1 },
                modulation: { type: 'sawtooth' },
                modulationEnvelope: { attack: 0.01, decay: 1.0, sustain: 0, release: 0.1 }
            }
        },
        {
            id: 'fx-downsweep',
            name: 'Down Sweep',
            category: 'FX',
            subcategory: 'Sweep',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '2n',
            settings: {
                harmonicity: 2,
                modulationIndex: 25,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 0.1 },
                modulation: { type: 'square' }
            }
        },
        {
            id: 'fx-noise-burst',
            name: 'Noise Burst',
            category: 'FX',
            subcategory: 'Impact',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '4n',
            settings: {
                noise: { type: 'white' },
                envelope: { attack: 0.001, decay: 0.5, sustain: 0 }
            }
        },
        {
            id: 'fx-riser',
            name: 'Riser',
            category: 'FX',
            subcategory: 'Sweep',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '1n',
            settings: {
                noise: { type: 'white' },
                envelope: { attack: 0.1, decay: 1.5, sustain: 0 }
            }
        },
        {
            id: 'fx-laser',
            name: 'Laser',
            category: 'FX',
            subcategory: 'Zap',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C6',
            previewDuration: '16n',
            settings: {
                harmonicity: 1,
                modulationIndex: 50,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
                modulation: { type: 'square' }
            }
        },
        {
            id: 'fx-glitch',
            name: 'Glitch',
            category: 'FX',
            subcategory: 'Digital',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C4',
            previewDuration: '32n',
            settings: {
                noise: { type: 'brown' },
                envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
            }
        },
        {
            id: 'fx-metallic',
            name: 'Metallic Hit',
            category: 'FX',
            subcategory: 'Impact',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C4',
            previewDuration: '4n',
            settings: {
                frequency: 200,
                envelope: { attack: 0.001, decay: 1.0, release: 0.5 },
                harmonicity: 8,
                modulationIndex: 40,
                resonance: 2000,
                octaves: 2
            }
        },
        {
            id: 'fx-siren',
            name: 'Siren',
            category: 'FX',
            subcategory: 'Alert',
            instrumentType: 'AMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '1n',
            settings: {
                harmonicity: 1,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.01, decay: 1.0, sustain: 0.5, release: 0.5 },
                modulation: { type: 'sine' },
                modulationEnvelope: { attack: 0.01, decay: 1.0, sustain: 0.8, release: 0.5 }
            }
        }
    ],

    'Ambient': [
        {
            id: 'ambient-texture',
            name: 'Texture Pad',
            category: 'Ambient',
            subcategory: 'Texture',
            instrumentType: 'DuoSynth',
            trackType: 'pad',
            previewNote: 'C3',
            previewDuration: '1n',
            settings: {
                vibratoAmount: 0.5,
                vibratoRate: 5,
                harmonicity: 1.5,
                voice0: {
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 3.0 }
                },
                voice1: {
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 3.0 }
                }
            }
        },
        {
            id: 'ambient-drone',
            name: 'Deep Drone',
            category: 'Ambient',
            subcategory: 'Drone',
            instrumentType: 'Synth',
            trackType: 'pad',
            previewNote: 'C2',
            previewDuration: '1n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 1.0, decay: 0.5, sustain: 0.9, release: 3.0 }
            }
        },
        {
            id: 'ambient-shimmer',
            name: 'Shimmer',
            category: 'Ambient',
            subcategory: 'Texture',
            instrumentType: 'FMSynth',
            trackType: 'pad',
            previewNote: 'C5',
            previewDuration: '1n',
            settings: {
                harmonicity: 4,
                modulationIndex: 1.5,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.8, decay: 0.5, sustain: 0.7, release: 3.0 },
                modulation: { type: 'triangle' }
            }
        },
        {
            id: 'ambient-dark',
            name: 'Dark Matter',
            category: 'Ambient',
            subcategory: 'Drone',
            instrumentType: 'AMSynth',
            trackType: 'pad',
            previewNote: 'C1',
            previewDuration: '1n',
            settings: {
                harmonicity: 1.5,
                oscillator: { type: 'sine' },
                envelope: { attack: 2.0, decay: 1.0, sustain: 0.9, release: 4.0 },
                modulation: { type: 'sine' },
                modulationEnvelope: { attack: 2.0, decay: 0.5, sustain: 0.8, release: 3.0 }
            }
        },
        {
            id: 'ambient-glass',
            name: 'Glass Pad',
            category: 'Ambient',
            subcategory: 'Texture',
            instrumentType: 'FMSynth',
            trackType: 'pad',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                harmonicity: 6,
                modulationIndex: 3,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.6, decay: 0.7, sustain: 0.8, release: 2.5 },
                modulation: { type: 'sine' }
            }
        }
    ],

    'Percussion': [
        {
            id: 'perc-tom-high',
            name: 'High Tom',
            category: 'Percussion',
            subcategory: 'Tom',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'G2',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.03,
                octaves: 3,
                envelope: { attack: 0.001, decay: 0.3, sustain: 0.01, release: 0.2 }
            }
        },
        {
            id: 'perc-tom-mid',
            name: 'Mid Tom',
            category: 'Percussion',
            subcategory: 'Tom',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'D2',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.03,
                octaves: 3,
                envelope: { attack: 0.001, decay: 0.35, sustain: 0.01, release: 0.25 }
            }
        },
        {
            id: 'perc-tom-low',
            name: 'Floor Tom',
            category: 'Percussion',
            subcategory: 'Tom',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'A1',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.04,
                octaves: 3,
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.3 }
            }
        },
        {
            id: 'perc-cowbell',
            name: 'Cowbell',
            category: 'Percussion',
            subcategory: 'Metal',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C4',
            previewDuration: '16n',
            settings: {
                frequency: 540,
                envelope: { attack: 0.001, decay: 0.15, release: 0.1 },
                harmonicity: 3,
                modulationIndex: 20,
                resonance: 3000,
                octaves: 1
            }
        },
        {
            id: 'perc-rim',
            name: 'Rim Shot',
            category: 'Percussion',
            subcategory: 'Hit',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C5',
            previewDuration: '32n',
            settings: {
                frequency: 400,
                envelope: { attack: 0.001, decay: 0.05, release: 0.02 },
                harmonicity: 7,
                modulationIndex: 15,
                resonance: 5000,
                octaves: 0.5
            }
        },
        {
            id: 'perc-shaker',
            name: 'Shaker',
            category: 'Percussion',
            subcategory: 'Shake',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C4',
            previewDuration: '16n',
            settings: {
                noise: { type: 'white' },
                envelope: { attack: 0.001, decay: 0.08, sustain: 0 }
            }
        },
        {
            id: 'perc-tambourine',
            name: 'Tambourine',
            category: 'Percussion',
            subcategory: 'Shake',
            instrumentType: 'MetalSynth',
            trackType: 'drums',
            previewNote: 'C5',
            previewDuration: '16n',
            settings: {
                frequency: 300,
                envelope: { attack: 0.001, decay: 0.2, release: 0.15 },
                harmonicity: 6,
                modulationIndex: 25,
                resonance: 4500,
                octaves: 1.2
            }
        },
        {
            id: 'perc-conga-high',
            name: 'Conga High',
            category: 'Percussion',
            subcategory: 'Conga',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'E3',
            previewDuration: '16n',
            settings: {
                pitchDecay: 0.01,
                octaves: 2,
                envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
            }
        },
        {
            id: 'perc-conga-low',
            name: 'Conga Low',
            category: 'Percussion',
            subcategory: 'Conga',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'A2',
            previewDuration: '8n',
            settings: {
                pitchDecay: 0.02,
                octaves: 2.5,
                envelope: { attack: 0.001, decay: 0.2, sustain: 0.01, release: 0.15 }
            }
        },
        {
            id: 'perc-bongo-high',
            name: 'Bongo High',
            category: 'Percussion',
            subcategory: 'Bongo',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'G3',
            previewDuration: '16n',
            settings: {
                pitchDecay: 0.008,
                octaves: 1.5,
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.08 }
            }
        },
        {
            id: 'perc-bongo-low',
            name: 'Bongo Low',
            category: 'Percussion',
            subcategory: 'Bongo',
            instrumentType: 'MembraneSynth',
            trackType: 'drums',
            previewNote: 'D3',
            previewDuration: '16n',
            settings: {
                pitchDecay: 0.01,
                octaves: 1.5,
                envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.1 }
            }
        }
    ],

    'Strings': [
        {
            id: 'strings-violin',
            name: 'Violin',
            category: 'Strings',
            subcategory: 'Bowed',
            instrumentType: 'DuoSynth',
            trackType: 'melody',
            previewNote: 'A4',
            previewDuration: '2n',
            settings: {
                vibratoAmount: 0.3,
                vibratoRate: 4,
                harmonicity: 2,
                voice0: {
                    oscillator: { type: 'sawtooth' },
                    envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 1.0 }
                },
                voice1: {
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 1.0 }
                }
            }
        },
        {
            id: 'strings-cello',
            name: 'Cello',
            category: 'Strings',
            subcategory: 'Bowed',
            instrumentType: 'DuoSynth',
            trackType: 'melody',
            previewNote: 'C3',
            previewDuration: '2n',
            settings: {
                vibratoAmount: 0.4,
                vibratoRate: 3,
                harmonicity: 1.5,
                voice0: {
                    oscillator: { type: 'sawtooth' },
                    envelope: { attack: 0.15, decay: 0.4, sustain: 0.8, release: 1.2 }
                },
                voice1: {
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.15, decay: 0.4, sustain: 0.8, release: 1.2 }
                }
            }
        },
        {
            id: 'strings-pizzicato',
            name: 'Pizzicato',
            category: 'Strings',
            subcategory: 'Plucked',
            instrumentType: 'PluckSynth',
            trackType: 'melody',
            previewNote: 'E4',
            previewDuration: '16n',
            settings: {
                attackNoise: 0.5,
                dampening: 3000,
                resonance: 0.95
            }
        },
        {
            id: 'strings-ensemble',
            name: 'String Ensemble',
            category: 'Strings',
            subcategory: 'Ensemble',
            instrumentType: 'DuoSynth',
            trackType: 'pad',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                vibratoAmount: 0.3,
                vibratoRate: 4,
                harmonicity: 1.5,
                voice0: {
                    oscillator: { type: 'sawtooth' },
                    envelope: { attack: 0.3, decay: 0.5, sustain: 0.8, release: 1.5 }
                },
                voice1: {
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.3, decay: 0.5, sustain: 0.8, release: 1.5 }
                }
            }
        }
    ],

    'Organ': [
        {
            id: 'organ-church',
            name: 'Church Organ',
            category: 'Organ',
            subcategory: 'Pipe',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.5 }
            }
        },
        {
            id: 'organ-hammond',
            name: 'Hammond Organ',
            category: 'Organ',
            subcategory: 'Electric',
            instrumentType: 'AMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 1,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.3 },
                modulation: { type: 'square' },
                modulationEnvelope: { attack: 0.5, decay: 0.2, sustain: 0.5, release: 0.3 }
            }
        },
        {
            id: 'organ-distorted',
            name: 'Distorted Organ',
            category: 'Organ',
            subcategory: 'Electric',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 1,
                modulationIndex: 5,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.02, decay: 0.2, sustain: 0.8, release: 0.4 },
                modulation: { type: 'sawtooth' }
            }
        }
    ],

    'Vocal': [
        {
            id: 'vocal-choir-ah',
            name: 'Choir Ah',
            category: 'Vocal',
            subcategory: 'Choir',
            instrumentType: 'DuoSynth',
            trackType: 'pad',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                vibratoAmount: 0.4,
                vibratoRate: 4,
                harmonicity: 2,
                voice0: {
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.3, decay: 0.5, sustain: 0.9, release: 2.0 }
                },
                voice1: {
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.3, decay: 0.5, sustain: 0.9, release: 2.0 }
                }
            }
        },
        {
            id: 'vocal-choir-oh',
            name: 'Choir Oh',
            category: 'Vocal',
            subcategory: 'Choir',
            instrumentType: 'AMSynth',
            trackType: 'pad',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                harmonicity: 1.5,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.4, decay: 0.5, sustain: 0.9, release: 2.5 },
                modulation: { type: 'sine' },
                modulationEnvelope: { attack: 0.4, decay: 0.3, sustain: 0.8, release: 2.0 }
            }
        },
        {
            id: 'vocal-lead',
            name: 'Synth Voice',
            category: 'Vocal',
            subcategory: 'Lead',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '4n',
            settings: {
                harmonicity: 3,
                modulationIndex: 3,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.0 },
                modulation: { type: 'triangle' }
            }
        }
    ],

    'Arp': [
        {
            id: 'arp-classic',
            name: 'Classic Arp',
            category: 'Arp',
            subcategory: 'Synth',
            instrumentType: 'PluckSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '16n',
            settings: {
                attackNoise: 0.8,
                dampening: 5000,
                resonance: 0.92
            }
        },
        {
            id: 'arp-digital',
            name: 'Digital Arp',
            category: 'Arp',
            subcategory: 'Synth',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '16n',
            settings: {
                harmonicity: 4,
                modulationIndex: 8,
                oscillator: { type: 'square' },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
                modulation: { type: 'sine' }
            }
        },
        {
            id: 'arp-chirp',
            name: 'Chirp Arp',
            category: 'Arp',
            subcategory: 'Synth',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C6',
            previewDuration: '32n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
            }
        },
        {
            id: 'arp-deep',
            name: 'Deep Arp',
            category: 'Arp',
            subcategory: 'Synth',
            instrumentType: 'MonoSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '16n',
            settings: {
                oscillator: { type: 'square' },
                filter: { Q: 4, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
                filterEnvelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.15, baseFrequency: 500, octaves: 3 }
            }
        }
    ],

    'Chords': [
        {
            id: 'chord-major-warm',
            name: 'Warm Major',
            category: 'Chords',
            subcategory: 'Major',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1.5 }
            }
        },
        {
            id: 'chord-minor-dark',
            name: 'Dark Minor',
            category: 'Chords',
            subcategory: 'Minor',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.08, decay: 0.4, sustain: 0.7, release: 2.0 }
            }
        },
        {
            id: 'chord-seventh',
            name: '7th Chord',
            category: 'Chords',
            subcategory: 'Extended',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.03, decay: 0.3, sustain: 0.5, release: 1.2 }
            }
        },
        {
            id: 'chord-sus',
            name: 'Sus Chord',
            category: 'Chords',
            subcategory: 'Sus',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'square' },
                envelope: { attack: 0.1, decay: 0.5, sustain: 0.8, release: 2.5 }
            }
        },
        {
            id: 'chord-power',
            name: 'Power Chord',
            category: 'Chords',
            subcategory: 'Power',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C3',
            previewDuration: '1n',
            settings: {
                oscillator: { type: 'fatsawtooth' },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 }
            }
        },
        {
            id: 'chord-diminished',
            name: 'Diminished',
            category: 'Chords',
            subcategory: 'Diminished',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.06, decay: 0.4, sustain: 0.6, release: 1.8 }
            }
        },
        {
            id: 'chord-ninth',
            name: '9th Chord',
            category: 'Chords',
            subcategory: 'Extended',
            instrumentType: 'PolySynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.1, decay: 0.5, sustain: 0.7, release: 2.0 }
            }
        }
    ],

    'Piano': [
        {
            id: 'piano-bright',
            name: 'Bright Piano',
            category: 'Piano',
            subcategory: 'Acoustic',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 1.5 }
            }
        },
        {
            id: 'piano-soft',
            name: 'Soft Piano',
            category: 'Piano',
            subcategory: 'Acoustic',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.005, decay: 0.8, sustain: 0.2, release: 2.0 }
            }
        },
        {
            id: 'piano-electric',
            name: 'Electric Piano',
            category: 'Piano',
            subcategory: 'Electric',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 2,
                modulationIndex: 4,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.5, sustain: 0.2, release: 1.0 },
                modulation: { type: 'square' }
            }
        },
        {
            id: 'piano-tine',
            name: 'Tine Piano',
            category: 'Piano',
            subcategory: 'Electric',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 1,
                modulationIndex: 2,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.6, sustain: 0.15, release: 1.2 },
                modulation: { type: 'sine' }
            }
        }
    ],

    'Bells': [
        {
            id: 'bell-tubular',
            name: 'Tubular Bell',
            category: 'Bells',
            subcategory: 'Metallic',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '1n',
            settings: {
                harmonicity: 12,
                modulationIndex: 2,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 1.5, sustain: 0.05, release: 2.5 },
                modulation: { type: 'sine' }
            }
        },
        {
            id: 'bell-glockenspiel',
            name: 'Glockenspiel',
            category: 'Bells',
            subcategory: 'Metallic',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C6',
            previewDuration: '4n',
            settings: {
                harmonicity: 10,
                modulationIndex: 4,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 },
                modulation: { type: 'square' }
            }
        },
        {
            id: 'bell-chime',
            name: 'Wind Chime',
            category: 'Bells',
            subcategory: 'Metallic',
            instrumentType: 'MetalSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '2n',
            settings: {
                frequency: 400,
                envelope: { attack: 0.001, decay: 2.0, release: 1.5 },
                harmonicity: 10,
                modulationIndex: 30,
                resonance: 4000,
                octaves: 2
            }
        },
        {
            id: 'bell-crystal',
            name: 'Crystal Bell',
            category: 'Bells',
            subcategory: 'Metallic',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '1n',
            settings: {
                harmonicity: 6,
                modulationIndex: 1,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.8, sustain: 0.1, release: 2.0 },
                modulation: { type: 'triangle' }
            }
        }
    ],

    'Woodwinds': [
        {
            id: 'woodwind-flute',
            name: 'Flute',
            category: 'Woodwinds',
            subcategory: 'Soft',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.05, decay: 0.3, sustain: 0.7, release: 0.8 }
            }
        },
        {
            id: 'woodwind-clarinet',
            name: 'Clarinet',
            category: 'Woodwinds',
            subcategory: 'Reed',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                oscillator: { type: 'square' },
                envelope: { attack: 0.03, decay: 0.4, sustain: 0.8, release: 0.9 }
            }
        },
        {
            id: 'woodwind-oboe',
            name: 'Oboe',
            category: 'Woodwinds',
            subcategory: 'Reed',
            instrumentType: 'AMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 2,
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.04, decay: 0.4, sustain: 0.75, release: 1.0 },
                modulation: { type: 'square' },
                modulationEnvelope: { attack: 0.3, decay: 0.3, sustain: 0.6, release: 0.8 }
            }
        },
        {
            id: 'woodwind-saxophone',
            name: 'Saxophone',
            category: 'Woodwinds',
            subcategory: 'Reed',
            instrumentType: 'AMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '2n',
            settings: {
                harmonicity: 1.5,
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.05, decay: 0.5, sustain: 0.8, release: 1.2 },
                modulation: { type: 'square' },
                modulationEnvelope: { attack: 0.2, decay: 0.4, sustain: 0.7, release: 1.0 }
            }
        }
    ],

    'Mallets': [
        {
            id: 'mallet-marimba',
            name: 'Marimba',
            category: 'Mallets',
            subcategory: 'Wood',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '4n',
            settings: {
                harmonicity: 2,
                modulationIndex: 3,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.8 },
                modulation: { type: 'triangle' }
            }
        },
        {
            id: 'mallet-vibraphone',
            name: 'Vibraphone',
            category: 'Mallets',
            subcategory: 'Metal',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '1n',
            settings: {
                harmonicity: 4,
                modulationIndex: 2,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 1.5, sustain: 0.3, release: 2.0 },
                modulation: { type: 'sine' }
            }
        },
        {
            id: 'mallet-xylophone',
            name: 'Xylophone',
            category: 'Mallets',
            subcategory: 'Wood',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '16n',
            settings: {
                harmonicity: 6,
                modulationIndex: 5,
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 },
                modulation: { type: 'square' }
            }
        }
    ],

    'Noise': [
        {
            id: 'noise-white',
            name: 'White Noise',
            category: 'Noise',
            subcategory: 'Static',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '4n',
            settings: {
                noise: { type: 'white' },
                envelope: { attack: 0.01, decay: 0.5, sustain: 0 }
            }
        },
        {
            id: 'noise-pink',
            name: 'Pink Noise',
            category: 'Noise',
            subcategory: 'Static',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '4n',
            settings: {
                noise: { type: 'pink' },
                envelope: { attack: 0.01, decay: 0.5, sustain: 0 }
            }
        },
        {
            id: 'noise-brown',
            name: 'Brown Noise',
            category: 'Noise',
            subcategory: 'Static',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '4n',
            settings: {
                noise: { type: 'brown' },
                envelope: { attack: 0.01, decay: 0.5, sustain: 0 }
            }
        },
        {
            id: 'noise-wind',
            name: 'Wind',
            category: 'Noise',
            subcategory: 'Natural',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C3',
            previewDuration: '1n',
            settings: {
                noise: { type: 'pink' },
                envelope: { attack: 0.5, decay: 2.0, sustain: 0 }
            }
        },
        {
            id: 'noise-ocean',
            name: 'Ocean',
            category: 'Noise',
            subcategory: 'Natural',
            instrumentType: 'NoiseSynth',
            trackType: 'drums',
            previewNote: 'C2',
            previewDuration: '1n',
            settings: {
                noise: { type: 'brown' },
                envelope: { attack: 1.0, decay: 3.0, sustain: 0 }
            }
        }
    ],

    'Electronic': [
        {
            id: 'elec-chip',
            name: 'Chiptune',
            category: 'Electronic',
            subcategory: 'Retro',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '8n',
            settings: {
                oscillator: { type: 'square' },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.1 }
            }
        },
        {
            id: 'elec-bitcrush',
            name: 'Bitcrush',
            category: 'Electronic',
            subcategory: 'Glitch',
            instrumentType: 'MonoSynth',
            trackType: 'melody',
            previewNote: 'C4',
            previewDuration: '8n',
            settings: {
                oscillator: { type: 'square' },
                filter: { Q: 8, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
                filterEnvelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1, baseFrequency: 1000, octaves: 4 }
            }
        },
        {
            id: 'elec-blip',
            name: 'Blip',
            category: 'Electronic',
            subcategory: 'Game',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C6',
            previewDuration: '32n',
            settings: {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 }
            }
        },
        {
            id: 'elec-beep',
            name: 'Beep',
            category: 'Electronic',
            subcategory: 'Game',
            instrumentType: 'Synth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '16n',
            settings: {
                oscillator: { type: 'square' },
                envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
            }
        },
        {
            id: 'elec-zap',
            name: 'Zap',
            category: 'Electronic',
            subcategory: 'Game',
            instrumentType: 'FMSynth',
            trackType: 'melody',
            previewNote: 'C5',
            previewDuration: '32n',
            settings: {
                harmonicity: 2,
                modulationIndex: 30,
                oscillator: { type: 'square' },
                envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
                modulation: { type: 'sine' }
            }
        }
    ]
};


export function getCategories(): string[] {
    return Object.keys(SOUND_LIBRARY);
}

export function getSoundsByCategory(category: string): SoundPreset[] {
    return SOUND_LIBRARY[category] || [];
}


export function getSoundById(id: string): SoundPreset | undefined {
    for (const category of Object.values(SOUND_LIBRARY)) {
        const sound = category.find(s => s.id === id);
        if (sound) return sound;
    }
    return undefined;
}


export function searchSounds(query: string): SoundPreset[] {
    const lowerQuery = query.toLowerCase();
    const results: SoundPreset[] = [];
    
    for (const category of Object.values(SOUND_LIBRARY)) {
        for (const sound of category) {
            if (
                sound.name.toLowerCase().includes(lowerQuery) ||
                sound.category.toLowerCase().includes(lowerQuery) ||
                sound.subcategory?.toLowerCase().includes(lowerQuery) ||
                sound.trackType.toLowerCase().includes(lowerQuery)
            ) {
                results.push(sound);
            }
        }
    }
    
    return results;
}
