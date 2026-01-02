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
            console.error("POST /api/projects - No session found");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, data, prompt } = body;

        console.log("Saving project for user:", session.user.id, "name:", name);

        const newProject = await db.insert(project).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            name: name || 'Untitled',
            prompt: prompt || '',
            data: data,
        }).returning();

        console.log("Project saved:", newProject[0]?.id);
        return NextResponse.json(newProject[0]);
    } catch (error) {
        console.error("POST /api/projects error:", error);
        return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            console.error("GET /api/projects - No session found");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log("Fetching projects for user:", session.user.id);

        const userProjects = await db.select().from(project).where(eq(project.userId, session.user.id)).orderBy(desc(project.createdAt));

        console.log("Found", userProjects.length, "projects");
        return NextResponse.json(userProjects);
    } catch (error) {
        console.error("GET /api/projects error:", error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
