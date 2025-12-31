/* ---------------- NOTE ↔ MIDI ---------------- */

const NOTE_TO_MIDI: Record<string, number> = {
  C:0,"C#":1,D:2,"D#":3,E:4,
  F:5,"F#":6,G:7,"G#":8,
  A:9,"A#":10,B:11
};

export function noteToMidi(note: string) {
  const [,n,o] = note.match(/^([A-G]#?)(\d)$/)!;
  return NOTE_TO_MIDI[n] + (parseInt(o)+1)*12;
}

export function midiToNote(midi:number) {
  const notes = Object.keys(NOTE_TO_MIDI);
  return `${notes[midi%12]}${Math.floor(midi/12)-1}`;
}

/* ---------------- RNG ---------------- */

export function seededRng(seed:number) {
  return () => (seed = seed * 16807 % 2147483647) / 2147483647;
}

/* ---------------- CHORDS ---------------- */

export const ROMAN_CHORDS: Record<string, number[]> = {
  i:[0,3,7],
  iv:[5,8,12],
  v:[7,11,14],
  VI:[8,12,15],
  VII:[10,14,17],
};

/* ---------------- VOICE LEADING ---------------- */

export function voiceLead(prev:number[], next:number[]) {
  return next.map((n,i)=>{
    if (!prev[i]) return n;
    while (n-prev[i]>6) n-=12;
    while (prev[i]-n>6) n+=12;
    return n;
  });
}
