import * as Tone from 'tone';

// Generate a simple drum loop buffer
export async function createDrumLoopBuffer(type: 'kick' | 'snare' | 'hihat' | 'beat'): Promise<Tone.ToneAudioBuffer> {
    const offline = new Tone.OfflineContext(1, 1, 44100);
    // basic dummy buffer, actual generation would be complex in offline context without easier sequence
    // So instead we will return null and handle synthesis in real-time or just return a simple noise burst
    // But better: we can return a URL to a synthesized blob?
    // Let's just return a placeholder for now and handle "Loop" as a synth sequence in the engine if URL is missing.
    return new Tone.ToneAudioBuffer();
}

export const MOCK_LOOPS: Record<string, string> = {
    // We will use standard Tone.js examples or just empty strings and handle them as Synths
    'lofi_drum_01': 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3', // Example
    'techno_kick_01': 'https://tonejs.github.io/audio/drum-samples/Techno/kick.mp3',
    'techno_hat_01': 'https://tonejs.github.io/audio/drum-samples/Techno/hihat.mp3',
    'soft_bass_01': 'https://tonejs.github.io/audio/berklee/bass_electric_01.mp3', // Placeholder
    'lead_synth_01': 'https://tonejs.github.io/audio/casio/A1.mp3',
};

export const LOOP_COLORS: Record<string, string> = {
    drums: "bg-orange-500",
    bass: "bg-blue-500",
    melody: "bg-pink-500",
    pad: "bg-purple-500",
    fx: "bg-emerald-500",
};
