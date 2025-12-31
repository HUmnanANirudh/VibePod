import * as Tone from 'tone';
export async function createDrumLoopBuffer(type: 'kick' | 'snare' | 'hihat' | 'beat'): Promise<Tone.ToneAudioBuffer> {
    const offline = new Tone.OfflineContext(1, 1, 44100);
    return new Tone.ToneAudioBuffer();
}
export const LOOP_COLORS: Record<string, string> = {
    drums: "bg-orange-500",
    bass: "bg-blue-500",
    melody: "bg-pink-500",
    pad: "bg-purple-500",
    fx: "bg-emerald-500",
};
