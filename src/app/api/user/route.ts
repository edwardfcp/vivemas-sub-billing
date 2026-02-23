import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
    await db.init();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]) as any;
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}
