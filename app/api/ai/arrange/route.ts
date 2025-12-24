import { NextRequest, NextResponse } from 'next/server';
import { generateProject } from '@/lib/generator';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;
        
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
        }

        // Simulate AI Latency
        await new Promise(r => setTimeout(r, 1500));

        const project = generateProject(prompt);
        
        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
