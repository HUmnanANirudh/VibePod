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
                                                description: "Synth, MembraneSynth, MetalSynth, FMSynth, or AMSynth"
                                            }
                                        },
                                        required: ["type"]
                                    },
                                    volume: {
                                        type: SchemaType.NUMBER,
                                        description: "Volume from 0 to 1. Must be >= 0."
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
            PRIMARY DIRECTIVE: Create a professional music arrangement for the user prompt: "${prompt}"
            
            DIRECTIONS:
            1. Adhere strictly to the genre, mood, and style requested by the user.
            2. Choose synth types (Synth, FMSynth, etc.) and BPM that best fit "${prompt}".
            3. Generate a complete song structure (Intro, Verse, Chorus, etc.) up to 96 bars.

            TECHNICAL REQUIREMENTS (CRITICAL):
            - DENSITY: Every track that is "active" must have a continuous stream of clips.
            - SMALL CLIPS: Every clip's 'durationBars' MUST BE EXACTLY 1 OR 2.
            - NO SILENCE GAPS: To fill 96 bars of drums, create 48 clips of 2 bars each. 
            - Each 2-bar clip must contain all notes for those 2 bars. 
            - 'startTime' is relative to the clip (e.g. "0:0:0" is the first beat of the clip).

            DAW ARCHITECTURE:
            - TRACKS: Use appropriate Track IDs (drums, lead, bass, pad, etc).
            - INSTRUMENTS: Assign professional Tone.js synth types.
            - PITCH: Drum tracks use C2 (kick), D2 (snare), F#2 (hats). Melodic tracks use musical pitches (e.g. C4, Eb4).

            Goal: A high-fidelity, rhythmically complex, and musically coherent output that WOWS the user.
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