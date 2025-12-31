import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { AIPatternSchema } from '@/lib/schema';
import { compileProject } from '@/lib/compiler';

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    if (!prompt) {
        return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const result = await generateText({
        model: google("gemini-2.5-flash-lite"),
        output: Output.object({ schema: AIPatternSchema }),
        system: `
You are a professional music arranger.

Return ONLY:
- bpm
- harmony (key + scale)
- seed (number)
- sections (name, bars, chords, energy)

Rules:
- Total bars must equal 96
- Use real chord progressions
- Energy must rise and fall
- Use real chord progressions

DO NOT output notes.
DO NOT output clips.
DO NOT output MIDI.
`,
        prompt
    });

    return NextResponse.json(
        compileProject(result.output)
    );
}