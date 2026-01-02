import { NextResponse } from 'next/server';
import { db } from '@/db';
import { project } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, data, prompt } = body;

    const newProject = await db.insert(project).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        name: name || 'Untitled',
        prompt: prompt || '',
        data: data,
    }).returning();

    return NextResponse.json(newProject[0]);
}

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProjects = await db.select().from(project).where(eq(project.userId, session.user.id)).orderBy(desc(project.createdAt));

    return NextResponse.json(userProjects);
}
