import * as Tone from 'tone';

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

/**
 * Comprehensive ToneJS Sound Library
 * Organized by category with variations
 */
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
        }
    ]
};

/**
 * Get all categories
 */
export function getCategories(): string[] {
    return Object.keys(SOUND_LIBRARY);
}

/**
 * Get sounds by category
 */
export function getSoundsByCategory(category: string): SoundPreset[] {
    return SOUND_LIBRARY[category] || [];
}

/**
 * Get sound by ID
 */
export function getSoundById(id: string): SoundPreset | undefined {
    for (const category of Object.values(SOUND_LIBRARY)) {
        const sound = category.find(s => s.id === id);
        if (sound) return sound;
    }
    return undefined;
}

/**
 * Search sounds
 */
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
