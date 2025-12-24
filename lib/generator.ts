import { Project, Track, Clip } from './schema';

// Heuristic Generator
export function generateProject(prompt: string): Project {
    const p = prompt.toLowerCase();
    
    let bpm = 120;
    let style = 'pop'; // pop, techno, lofi, ambient

    if (p.includes('lofi') || p.includes('chill') || p.includes('study')) {
        bpm = 80;
        style = 'lofi';
    } else if (p.includes('techno') || p.includes('club') || p.includes('dance')) {
        bpm = 135;
        style = 'techno';
    } else if (p.includes('ambient') || p.includes('meditation')) {
        bpm = 70;
        style = 'ambient';
    }

    const tracks: Track[] = [];

    // Helper to create clips
    const createClips = (pattern: 'full' | 'sparse' | 'intro'): Clip[] => {
        const clips: Clip[] = [];
        if (pattern === 'full') {
            clips.push({ startBar: 0, durationBars: 4 });
            clips.push({ startBar: 4, durationBars: 4 });
        } else if (pattern === 'sparse') {
            clips.push({ startBar: 0, durationBars: 2 });
            clips.push({ startBar: 4, durationBars: 2 });
        } else if (pattern === 'intro') {
            clips.push({ startBar: 4, durationBars: 4 });
        }
        return clips;
    };

    // Drums
    tracks.push({
        id: 'track-drums',
        type: 'drums',
        loopId: style === 'techno' ? 'techno_kick_01' : 'lofi_drum_01',
        volume: 0.8,
        pitch: 0,
        muted: false,
        clips: createClips('full')
    });

    // Bass
    if (style !== 'ambient') {
        tracks.push({
            id: 'track-bass',
            type: 'bass',
            loopId: style === 'techno' ? 'rolling_bass_02' : 'soft_bass_01',
            volume: 0.7,
            pitch: 0,
            muted: false,
            clips: createClips('full')
        });
    }

    // Melody / Pad
    if (style === 'ambient' || style === 'lofi') {
        tracks.push({
            id: 'track-pad',
            type: 'pad',
            loopId: 'ambient_pad_01',
            volume: 0.6,
            pitch: 0,
            muted: false,
            clips: createClips('full')
        });
    }

    if (style === 'techno') {
        tracks.push({
            id: 'track-hats',
            type: 'drums',
            loopId: 'techno_hat_01',
            volume: 0.6,
            pitch: 0,
            muted: false,
            clips: createClips('sparse')
        });
    }

    if (style === 'pop' || style === 'lofi') {
        tracks.push({
            id: 'track-lead',
            type: 'melody',
            loopId: 'lead_synth_01',
            volume: 0.75,
            pitch: 0,
            muted: false,
            clips: createClips('intro')
        });
    }

    return { bpm, tracks };
}
