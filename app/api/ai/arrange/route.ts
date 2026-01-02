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
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 1.2,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 16384,
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
        const randomSeed = Math.floor(Math.random() * 1000000);
        const styleVariations = [
            "minimal and spacious with lots of breaks",
            "dense and layered with complex rhythms",
            "groove-focused with syncopated patterns",
            "atmospheric with evolving textures",
            "energetic with driving momentum",
            "experimental with unusual sound design",
            "melodic with memorable hooks",
            "dark and moody with heavy bass"
        ];
        const randomStyle = styleVariations[Math.floor(Math.random() * styleVariations.length)];
        
        const keySignatures = ["C major", "D minor", "G major", "A minor", "E minor", "F major", "Bb major", "C minor"];
        const randomKey = keySignatures[Math.floor(Math.random() * keySignatures.length)];

        const result = await model.generateContent(`
You are a world-class electronic music producer. Create a ${randomStyle} ${prompt.toLowerCase()} arrangement in ${randomKey}.

🎲 RANDOMIZATION SEED: ${randomSeed} - Make this track UNIQUE and DIFFERENT from others!

════════════════════════════════════════════════════════════════════════
🎯 CRITICAL REQUIREMENTS
════════════════════════════════════════════════════════════════════════
- Exactly 12 bars (bar 0-11) - enough for intro, build, drop
- 5-7 tracks for RICH, layered sound
- Each clip: 2 bars long, 4-6 notes MAX (keep it tight!)
- BPM: Vary by genre (Techno 128-138, House 118-128, Lo-Fi 65-90, Trap 130-150, Dubstep 138-145)
- Key: ${randomKey} - USE THIS KEY SIGNATURE FOR ALL MELODIC ELEMENTS!

🎨 STYLE FOCUS: ${randomStyle.toUpperCase()}
Make this arrangement reflect this specific style. Be creative and experimental!

════════════════════════════════════════════════════════════════════════
🎹 INSTRUMENT SELECTION (BE DIVERSE!)
════════════════════════════════════════════════════════════════════════
DRUMS (1-2 tracks) - Mix it up each time:
  - MembraneSynth (kicks, toms) - organic drum sounds
  - NoiseSynth (hats, cymbals, white noise) - crispy percussion
  - MetalSynth (metallic percussion, bells) - industrial/robotic
  Pitches: C2=kick, D2=snare, F#2=closed-hat, G2=open-hat, A2=toms, B2=rim, C#3=crash

BASS (1 track) - Choose based on style:
  - MonoSynth: classic analog, warm (house, techno)
  - FMSynth: aggressive, growly (dubstep, trap)
  - AMSynth: deep, sub-heavy (dnb, trap)

LEADS/MELODY (2-3 tracks) - Vary instruments:
  - Synth: bright, cutting leads
  - PluckSynth: organic, guitar-like arpeggios
  - DuoSynth: thick, detuned synths
  - FMSynth: bell-like, crystalline melodies
  - MetalSynth: metallic, robotic leads

PADS/ATMOSPHERE (1-2 tracks):
  - AMSynth: lush, evolving pads
  - DuoSynth: wide stereo atmosphere
  - MonoSynth: droning bass pad
  - Synth: filtered pad sounds

════════════════════════════════════════════════════════════════════════
🎛️ EFFECTS VARIETY (RANDOMIZE EACH TRACK!)
════════════════════════════════════════════════════════════════════════
Choose 2-3 DIFFERENT effects per track from these categories:

TEXTURE:
  - Distortion (0.2-0.4 wet): grit, warmth, analog color
  - BitCrusher (0.15-0.3 wet): lo-fi, retro, digital grit
  - Chebyshev (0.2-0.35 wet): harmonic saturation

MODULATION:
  - Chorus (0.25-0.4 wet): width, shimmer
  - Phaser (0.2-0.35 wet): swirling movement
  - Tremolo (0.25-0.4 wet): pulsing rhythm
  - Vibrato (0.15-0.3 wet): pitch wobble
  - AutoFilter (0.3-0.45 wet): sweeping filter
  - AutoWah (0.25-0.4 wet): funky movement

SPACE:
  - Reverb (0.25-0.45 wet): hall, chamber
  - JCReverb (0.2-0.35 wet): spring reverb
  - Freeverb (0.3-0.5 wet): lush space
  - FeedbackDelay (0.2-0.4 wet): classic delay
  - PingPongDelay (0.25-0.4 wet): stereo delay

SPECIAL:
  - PitchShift (0.15-0.3 wet): octaves, harmonies
  - StereoWidener (0.3-0.5 wet): wide stereo
  - FrequencyShifter (0.15-0.3 wet): detuned, alien
  - AutoPanner (0.25-0.4 wet): stereo movement

IMPORTANT: Use DIFFERENT effect combinations for each track. Don't repeat patterns!

════════════════════════════════════════════════════════════════════════
🎨 ARRANGEMENT STRUCTURES (CHOOSE ONE AT RANDOM)
════════════════════════════════════════════════════════════════════════
Structure A - Classic Build:
  Bars 0-3: Minimal intro (drums + 1 element)
  Bars 4-7: Add layers gradually
  Bars 8-11: Full drop

Structure B - Immediate Drop:
  Bars 0-3: Start heavy, full energy
  Bars 4-7: Break down, filter sweeps
  Bars 8-11: Build back up

Structure C - Breakbeat:
  Bars 0-2: Drum intro
  Bars 3-5: Add bass and melody
  Bars 6-7: Break/drop
  Bars 8-11: Full arrangement

Structure D - Progressive:
  Bars 0-5: Slow build with evolving pads
  Bars 6-7: Tension rise
  Bars 8-11: Explosive drop

Pick one and execute it perfectly!

════════════════════════════════════════════════════════════════════════
🎼 MELODIC VARIETY (IMPORTANT!)
════════════════════════════════════════════════════════════════════════
${randomKey} scale notes to use:
- Root notes: C, D, E, F, G, A, B (adjust for key)
- Octaves: 2 (bass), 3 (mid), 4 (melody), 5 (high leads)
- Create DIFFERENT melodic patterns each time:
  * Arpeggios: 1-3-5-7 patterns
  * Scales runs: ascending/descending
  * Call and response: question/answer phrases
  * Rhythmic stabs: short, punchy notes
  * Long pads: whole note sustains

════════════════════════════════════════════════════════════════════════
🎚️ MIX LEVELS
════════════════════════════════════════════════════════════════════════
- Drums: 0.65-0.7
- Bass: 0.55-0.65
- Leads: 0.45-0.55
- Pads/FX: 0.25-0.4
- Percussion: 0.5-0.6

════════════════════════════════════════════════════════════════════════
✅ VARIETY CHECKLIST
════════════════════════════════════════════════════════════════════════
✓ Use 5+ DIFFERENT instrument types
✓ Use 8+ DIFFERENT effect types total
✓ Create UNIQUE rhythm patterns (not the same as previous generations)
✓ Vary note durations and velocities
✓ Try unusual instrument/effect combos
✓ Make melodic patterns memorable and different
✓ Consider the random style: ${randomStyle}
✓ Use the specified key: ${randomKey}

REMEMBER: This track should sound COMPLETELY DIFFERENT from other generations!
        `);


        const rawText = result.response.text();
        
        if (!rawText || rawText.trim() === "") {
            throw new Error("Empty response from Gemini");
        }

        const responseText = rawText.replace(/```json|```/g, '').trim();
        
        if (!responseText) {
            throw new Error("Response became empty after cleanup");
        }

        const project = JSON.parse(responseText);

        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json({ 
            error: error.message,
            details: "Check server logs for full response"
        }, { status: 500 });
    }
}