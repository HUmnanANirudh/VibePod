import { NextResponse } from 'next/server';
import { db } from '@/db';
import { project } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
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
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userProjects = await db.select().from(project).where(eq(project.userId, session.user.id)).orderBy(desc(project.createdAt));

        return NextResponse.json(userProjects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
