import * as Tone from 'tone';

/**
 * Music theory utilities for VibePod
 * Ensures AI-generated notes are musically coherent
 */

// Scale definitions (semitones from root)
export const SCALES: Record<string, number[]> = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonicMajor: [0, 2, 4, 7, 9],
    pentatonicMinor: [0, 3, 5, 7, 10],
    blues: [0, 3, 5, 6, 7, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10]
};

/**
 * Convert note name to MIDI number
 * @param note - Note string like "C4", "D#2"
 * @returns MIDI number (0-127)
 */
export function noteToMidi(note: string): number {
    return Tone.Frequency(note).toMidi();
}

/**
 * Convert MIDI number to note name
 * @param midi - MIDI number (0-127)
 * @returns Note string like "C4"
 */
export function midiToNote(midi: number): string {
    return Tone.Frequency(midi, 'midi').toNote();
}

/**
 * Snap a note to the nearest note in a musical scale
 * Ensures all AI-generated notes are musically coherent
 * 
 * @param note - Input note (e.g., "C#4")
 * @param root - Scale root note (e.g., "C2")
 * @param scaleName - Scale type from SCALES
 * @returns Corrected note in the specified scale
 */
export function snapToScale(
    note: string,
    root: string = 'C2',
    scaleName: string = 'minor'
): string {
    const midi = noteToMidi(note);
    const rootMidi = noteToMidi(root);
    const intervals = SCALES[scaleName] || SCALES.minor;

    let closestMidi = midi;
    let minDistance = Infinity;

    // Search across multiple octaves for closest scale note
    for (let octave = -2; octave <= 2; octave++) {
        for (const interval of intervals) {
            const candidateMidi = rootMidi + interval + (octave * 12);
            const distance = Math.abs(candidateMidi - midi);

            if (distance < minDistance) {
                minDistance = distance;
                closestMidi = candidateMidi;
            }
        }
    }

    return midiToNote(closestMidi);
}

/**
 * Add slight velocity randomization for human feel
 * @param baseVelocity - Base velocity (0-1)
 * @param amount - Randomization amount (0-1)
 * @returns Randomized velocity
 */
export function humanizeVelocity(baseVelocity: number, amount: number = 0.15): number {
    const randomOffset = (Math.random() - 0.5) * amount;
    return Math.max(0, Math.min(1, baseVelocity + randomOffset));
}

/**
 * Detect likely scale from a set of notes
 * @param notes - Array of note strings
 * @returns Most likely scale name
 */
export function detectScale(notes: string[]): string {
    const midiNotes = notes.map(noteToMidi);
    const uniqueNotes = [...new Set(midiNotes.map(m => m % 12))].sort();

    let bestMatch = 'minor';
    let bestScore = 0;

    for (const [scaleName, intervals] of Object.entries(SCALES)) {
        const scaleNotes = new Set(intervals);
        const matches = uniqueNotes.filter(n => scaleNotes.has(n)).length;

        if (matches > bestScore) {
            bestScore = matches;
            bestMatch = scaleName;
        }
    }

    return bestMatch;
}
