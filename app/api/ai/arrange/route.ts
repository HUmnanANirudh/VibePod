import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "");
export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    if (!prompt) {
        return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0,
                maxOutputTokens: 16384,  // 12 bars, 5-7 tracks, rich arrangements
                responseSchema: ({
                    type: SchemaType.OBJECT,
                    properties: {
                        bpm: { type: SchemaType.NUMBER },
                        tracks: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING },
                                    type: {
                                        type: SchemaType.STRING,
                                        description: "drums, bass, melody, pad, or fx"
                                    },
                                    instrument: {
                                        type: SchemaType.OBJECT,
                                        properties: {
                                            type: {
                                                type: SchemaType.STRING,
                                                description: "Synth, AMSynth, FMSynth, DuoSynth, MonoSynth, MembraneSynth, MetalSynth, PluckSynth, NoiseSynth"
                                            }
                                        },
                                        required: ["type"]
                                    },
                                    effects: {
                                        type: SchemaType.ARRAY,
                                        items: {
                                            type: SchemaType.OBJECT,
                                            properties: {
                                                type: {
                                                    type: SchemaType.STRING,
                                                    description: "Distortion, Reverb, Chorus, FeedbackDelay, Phaser, BitCrusher, AutoFilter, AutoWah, Tremolo, Vibrato, PingPongDelay, JCReverb, Freeverb, PitchShift, Chebyshev, StereoWidener, AutoPanner, FrequencyShifter"
                                                },
                                                wet: { type: SchemaType.NUMBER, description: "0 to 1" },
                                                options: {
                                                    type: SchemaType.OBJECT,
                                                    description: "Specific FX settings",
                                                    properties: {
                                                        distortion: { type: SchemaType.NUMBER },
                                                        decay: { type: SchemaType.NUMBER },
                                                        delayTime: { type: SchemaType.STRING },
                                                        bits: { type: SchemaType.NUMBER }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    volume: {
                                        type: SchemaType.NUMBER,
                                        description: "Volume from 0 to 1. MUST BE 0.5 to 0.7 for heavy tracks, 0.2 to 0.4 for sparse ones."
                                    },
                                    muted: { type: SchemaType.BOOLEAN },
                                    clips: {
                                        type: SchemaType.ARRAY,
                                        items: {
                                            type: SchemaType.OBJECT,
                                            properties: {
                                                startBar: {
                                                    type: SchemaType.NUMBER,
                                                    description: "Starting bar index. Must be >= 0."
                                                },
                                                durationBars: {
                                                    type: SchemaType.NUMBER,
                                                    description: "Duration in bars. MUST BE 1 OR 2 BARS ONLY."
                                                },
                                                notes: {
                                                    type: SchemaType.ARRAY,
                                                    items: {
                                                        type: SchemaType.OBJECT,
                                                        properties: {
                                                            pitch: { type: SchemaType.STRING },
                                                            startTime: { type: SchemaType.STRING },
                                                            duration: { type: SchemaType.STRING },
                                                            velocity: {
                                                                type: SchemaType.NUMBER,
                                                                description: "Velocity from 0 to 1. Must be >= 0."
                                                            }
                                                        },
                                                        required: ["pitch", "startTime", "duration"]
                                                    }
                                                }
                                            },
                                            required: ["startBar", "durationBars", "notes"]
                                        }
                                    }
                                },
                                required: ["id", "type", "instrument", "volume", "muted", "clips"]
                            }
                        }
                    },
                    required: ["bpm", "tracks"]
                } as any)
            }
        });

        const result = await model.generateContent(`
You are a world-class electronic music producer. Create an immersive, professional ${prompt.toLowerCase()} arrangement.

════════════════════════════════════════════════════════════════════════
🎯 CRITICAL REQUIREMENTS
════════════════════════════════════════════════════════════════════════
- Exactly 12 bars (bar 0-11) - enough for intro, build, drop
- 5-7 tracks for RICH, layered sound
- Each clip: 2 bars long, 4-6 notes MAX (keep it tight!)
- BPM: Match genre (Techno 130-135, House 122-126, Lo-Fi 70-85, Trap 135-145)

════════════════════════════════════════════════════════════════════════
🎹 FULL INSTRUMENT PALETTE (USE THEM ALL!)
════════════════════════════════════════════════════════════════════════
DRUMS (1-2 tracks):
  - MembraneSynth (kicks, toms)
  - NoiseSynth (hats, cymbals, white noise)
  - MetalSynth (metallic percussion, bells)
  Pitches: C2=kick, D2=snare, F#2=hats, A2=toms, C#3=crash

BASS (1 track):
  - MonoSynth (classic analog bass)
  - FMSynth (growly FM bass)
  - AMSynth (warm amplitude-modulated bass)

LEADS/MELODY (2-3 tracks):
  - Synth (classic sawtooth leads)
  - PluckSynth (organic plucks, guitar-like)
  - DuoSynth (detuned dual oscillators, thick)
  - FMSynth (bell-like, crystalline)

PADS/ATMOSPHERE (1-2 tracks):
  - AMSynth (lush pads)
  - DuoSynth (wide stereo pads)
  - MonoSynth (droning bass pad)

════════════════════════════════════════════════════════════════════════
🎛️ FULL EFFECTS ARSENAL (BE CREATIVE!)
════════════════════════════════════════════════════════════════════════
DISTORTION/COLOR:
  - Distortion (grit, warmth)
  - BitCrusher (lo-fi, retro)
  - Chebyshev (waveshaping, harmonic distortion)

MODULATION:
  - Chorus (width, movement)
  - Phaser (swirling, psychedelic)
  - Tremolo (rhythmic volume)
  - Vibrato (pitch wobble)
  - AutoFilter (sweeping filter)
  - AutoWah (funky wah movement)
  - AutoPanner (stereo movement)
  - FrequencyShifter (detuned, alien)

SPACE/TIME:
  - Reverb (room, hall)
  - JCReverb (spring reverb)
  - Freeverb (lush algorithmic reverb)
  - FeedbackDelay (classic delay)
  - PingPongDelay (stereo bouncing delay)
  - PitchShift (octaves, harmonies)

DYNAMICS:
  - StereoWidener (wide stereo)

Use 2-3 effects per track. Wet: 0.15-0.45 MAX.

════════════════════════════════════════════════════════════════════════
🎨 ARRANGEMENT STRUCTURE (12 BARS)
════════════════════════════════════════════════════════════════════════
Bars 0-3: INTRO - Minimal, build tension
Bars 4-7: BUILD - Add layers, energy rises
Bars 8-11: DROP/MAIN - Full arrangement, all tracks

Start sparse, build to full richness!

════════════════════════════════════════════════════════════════════════
🎚️ MIX LEVELS (CRITICAL)
════════════════════════════════════════════════════════════════════════
- Drums: 0.65-0.7
- Bass: 0.6
- Leads: 0.45-0.55
- Pads/FX: 0.25-0.35
- Percussion: 0.5

════════════════════════════════════════════════════════════════════════
✅ QUALITY CHECKLIST
════════════════════════════════════════════════════════════════════════
✓ Use AT LEAST 5 different instrument types
✓ Use AT LEAST 8 different effect types across all tracks
✓ Create dynamic arrangement (intro -> build -> drop)
✓ Leave space - not every track plays every bar
✓ Drum pitches: C2=kick, D2=snare, F#2=hats
✓ Keep notes musical and purposeful (4-6 per clip)
✓ Make it sound PROFESSIONAL and CLUB-READY

        `);


        const rawText = result.response.text();
        if (!rawText) {
            throw new Error("Empty response from Gemini");
        }

        const responseText = rawText.replace(/```json|```/g, '').trim();
        const project = JSON.parse(responseText);

        return NextResponse.json(project);
    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}