import { NextResponse } from 'next/server';
import { db } from '@/db';
import { project } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, data, prompt } = body;
        const updateData: any = {
            updatedAt: new Date(),
        };
        if (name !== undefined) updateData.name = name;
        if (data !== undefined) updateData.data = data;
        if (prompt !== undefined) updateData.prompt = prompt;
        const updated = await db
            .update(project)
            .set(updateData)
            .where(
                and(
                    eq(project.id, id),
                    eq(project.userId, session.user.id)
                )
            )
            .returning();

        if (!updated.length) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(updated[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const deleted = await db
            .delete(project)
            .where(
                and(
                    eq(project.id, id),
                    eq(project.userId, session.user.id)
                )
            )
            .returning();

        if (!deleted.length) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
