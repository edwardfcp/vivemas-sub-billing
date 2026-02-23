import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
        if (!user || !user.stripe_customer_id) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
