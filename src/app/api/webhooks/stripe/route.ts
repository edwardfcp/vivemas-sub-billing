import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const session = event.data.object as any;

    switch (event.type) {
        case 'checkout.session.completed': {
            const subscriptionId = session.subscription as string;
            const userId = session.metadata.userId;

            // Extract subscription data
            const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;

            await db.query(`
        UPDATE users SET 
        subscription_status = ?, 
        price_id = ?, 
        period_end = ? 
        WHERE id = ?
      `, [
                subscription.status,
                subscription.items.data[0].price.id,
                subscription.current_period_end,
                userId
            ]);

            await db.query(`
        INSERT INTO orders (id, user_id, amount, currency, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
                session.id,
                userId,
                session.amount_total,
                session.currency,
                'paid',
                Math.floor(Date.now() / 1000)
            ]);
            break;
        }

        case 'invoice.paid': {
            const subscriptionId = session.subscription as string;
            if (subscriptionId) {
                const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;
                await db.query(`
          UPDATE users SET 
          subscription_status = 'active', 
          period_end = ? 
          WHERE stripe_customer_id = ?
        `, [subscription.current_period_end, session.customer as string]);
            }
            break;
        }

        case 'invoice.payment_failed': {
            await db.query(`
        UPDATE users SET subscription_status = 'past_due' 
        WHERE stripe_customer_id = ?
      `, [session.customer as string]);
            break;
        }

        case 'customer.subscription.deleted': {
            await db.query(`
        UPDATE users SET subscription_status = 'canceled', price_id = NULL, period_end = NULL 
        WHERE stripe_customer_id = ?
      `, [session.customer as string]);
            break;
        }

        case 'customer.subscription.updated': {
            const subscription = session as any;
            await db.query(`
        UPDATE users SET 
        subscription_status = ?, 
        price_id = ?, 
        period_end = ? 
        WHERE stripe_customer_id = ?
      `, [
                subscription.status,
                subscription.items.data[0].price.id,
                subscription.current_period_end,
                subscription.customer as string
            ]);
            break;
        }

        case 'charge.refunded': {
            await db.query(`
        UPDATE orders SET status = 'refunded' 
        WHERE id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE stripe_customer_id = ?) LIMIT 1)
      `, [session.customer as string]);
            break;
        }
    }

    return NextResponse.json({ received: true });
}
