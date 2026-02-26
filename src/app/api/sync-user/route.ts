import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        await db.init();
        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]) as any;
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.stripe_customer_id) {
            return NextResponse.json({ error: 'User has no Stripe Customer ID' }, { status: 400 });
        }

        // Fetch active subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripe_customer_id,
            status: 'active',
            limit: 1,
        });

        if (subscriptions.data.length > 0) {
            const sub = subscriptions.data[0];
            await db.query(`
                UPDATE users SET 
                subscription_status = 'active',
                price_id = ?,
                period_end = ?
                WHERE id = ?
            `, [sub.items.data[0].price.id, sub.current_period_end, userId]);

            return NextResponse.json({
                success: true,
                message: 'User status synced to ACTIVE',
                details: {
                    price_id: sub.items.data[0].price.id,
                    period_end: new Date(sub.current_period_end * 1000).toLocaleDateString()
                }
            });
        } else {
            return NextResponse.json({
                success: true,
                message: 'No active subscriptions found in Stripe for this user.'
            });
        }
    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
