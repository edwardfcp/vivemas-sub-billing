import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId, targetPriceId } = await req.json();

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
        if (!user || !user.stripe_customer_id) {
            return NextResponse.json({ error: 'User or customer not found' }, { status: 404 });
        }

        // Get active subscription
        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripe_customer_id,
            status: 'active',
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
        }

        const subscription = subscriptions.data[0];

        // Update subscription with proration
        const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
            items: [{
                id: subscription.items.data[0].id,
                price: targetPriceId,
            }],
            proration_behavior: 'always_invoice', // Charge immediately
            payment_behavior: 'pending_if_incomplete',
        });

        // Note: Stripe will automatically trigger a webhook for 'customer.subscription.updated'
        // which our webhook handler already handles to update the DB.

        return NextResponse.json({ success: true, subscriptionId: updatedSubscription.id });
    } catch (error: any) {
        console.error('Upsell error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
