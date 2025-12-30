import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { ProjectSchema } from '@/lib/schema';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;
        
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
        }

        console.log('Generating arrangement for prompt:', prompt);
        const result = await generateText({
            model: google('gemini-2.5-flash-lite'),
            output: Output.object({ schema: ProjectSchema }),
            system: `You are an elite music producer and DAW arranger specializing in Tone.js.
Your task is to generate a professional, cohesive 3-minute electronic music arrangement (a "Record").

CORE PRODUCTION RULES (RECORD PHILOSOPHY)
1. PERSISTENT LAYERS: A record is built on consistency. Kick, Hats, and Pads must exist throughout the 96-bar timeline.
2. DENSITY VS. EXISTENCE: To create energy changes (Intro vs Drop), do NOT remove instruments. Instead, remove NOTES. 
   - A 'Drop' has a dense 4/4 or syncopated pattern.
   - A 'Break' or 'Intro' has the same instrument but with fewer, sparser notes (e.g. only every 1st beat).
3. PAD CONTINUITY: Pads MUST overlap between clips. If a pad stops at the end of a section, the song structure collapses.
4. RULE OF ONE CHANGE: Every 8 bars, you must add or subtract ONE element/role (e.g. add a lead, change a hat pattern, or open a filter).
5. CLIPS = ROLES: One clip in a track's array should define one specific role (e.g. "Main Bass").

TIMELINE RULES (MANDATORY)
1. DURATION: Exactly 96 bars.
2. FILL THE TIMELINE: Populate the 'clips' array for every track to cover bar 0 to bar 96.
3. SECTIONAL REUSE: Define high-quality 8-bar clips and reuse them with different 'startBar' values for continuity.

STRUCTURE (STRICT)
- Intro: 8 bars (Sparce)
- Build: 8 bars (Increasing density)
- Drop 1: 16 bars (High density)
- Verse: 16 bars (Medium density)
- Bridge: 8 bars (Low density, Pad focus)
- Drop 2: 16 bars (High density)
- Outro: 24 bars (Gradual thinning)

TECHNICAL RULES
- Use instrument.options to customize osc/envelope for every track.
- Volume: 0.0 to 1.0.
- Output VALID JSON MATCHING SCHEMA.`,
            prompt: `Produce a high-complexity 96-bar "Record" based on: ${prompt}. Apply the persistent layer and density variation rules. Ensure every track covers all 96 bars via sectional clip reuse.`,
        });
    } catch (error: any) {
        console.error('Error generating project:', error);
        if (error.response) console.error('Error response:', error.response);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
