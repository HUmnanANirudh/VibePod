import type { AIPattern } from "./schema";
import { noteToMidi, midiToNote, seededRng, ROMAN_CHORDS, voiceLead } from "./musicUtils";

/* ---------------- TRACK HELPERS ---------------- */

function makeTrack(id:string,type:string,clips:any[]) {
  return {
    id,
    type,
    instrument: { type: "Synth" },
    volume: 0.8,
    muted: false,
    clips
  };
}

/* ---------------- COMPILER ---------------- */

export function compileProject(ai:AIPattern) {
  const rand = seededRng(ai.seed);
  const root = noteToMidi(`${ai.harmony.key}3`);
  let bar = 0;

  const pad:any[] = [];
  const bass:any[] = [];
  const melody:any[] = [];
  const drums:any[] = [];

  let lastChord:number[] = [];

  for (const section of ai.sections) {
    const barsPerChord = section.bars / section.chords.length;

    for (const roman of section.chords) {
      const base = root + ROMAN_CHORDS[roman][0];
      let chord = ROMAN_CHORDS[roman].map(i=>base+i);
      chord = voiceLead(lastChord, chord);
      lastChord = chord;

      /* PAD */
      pad.push({
        startBar: bar,
        durationBars: barsPerChord,
        notes: chord.map(n=>({
          pitch: midiToNote(n),
          startTime:"0:0:0",
          duration:"1m",
          velocity:0.4
        }))
      });

      /* BASS */
      bass.push({
        startBar: bar,
        durationBars: barsPerChord,
        notes:[{
          pitch:midiToNote(base-12),
          startTime:"0:0:0",
          duration:"1m",
          velocity:0.9
        }]
      });

      /* MELODY */
      melody.push({
        startBar: bar,
        durationBars: barsPerChord,
        notes: chord
          .filter(()=>rand()>0.4)
          .map(n=>({
            pitch:midiToNote(n+12),
            startTime:`${Math.floor(rand()*4)}:0:0`,
            duration:"8n",
            velocity:0.7
          }))
      });

      /* DRUMS */
      for (let i=0;i<barsPerChord;i++) {
        drums.push({
          pitch:"C1",
          startTime:`${i}:0:0`,
          duration:"4n",
          velocity:0.9
        });
        if (section.energy!=="low") {
          drums.push({
            pitch:"F#1",
            startTime:`${i}:2:0`,
            duration:"8n",
            velocity:0.6
          });
        }
      }

      bar += barsPerChord;
    }
  }

  return {
    bpm: ai.bpm,
    tracks:[
      makeTrack("pad","pad",pad),
      makeTrack("bass","bass",bass),
      makeTrack("melody","melody",melody),
      makeTrack("drums","drums",[{
        startBar:0,
        durationBars:bar,
        notes:drums
      }])
    ]
  };
}
