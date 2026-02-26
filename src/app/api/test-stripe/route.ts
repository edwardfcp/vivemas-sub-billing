import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
    const key = process.env.STRIPE_SECRET_KEY || '';
    const maskedKey = key ? `${key.substring(0, 7)}...${key.substring(key.length - 4)}` : 'MISSING';

    try {
        console.log('Testing Stripe connection...');
        const customers = await stripe.customers.list({ limit: 1 });
        return NextResponse.json({
            success: true,
            message: 'Stripe connection successful',
            keyInfo: {
                present: !!key,
                masked: maskedKey,
                length: key.length,
                type: key.startsWith('sk_test') ? 'test' : 'live'
            },
            customerCount: customers.data.length
        });
    } catch (error: any) {
        console.error('Stripe diagnostic error:', error);
        return NextResponse.json({
            success: false,
            message: 'Stripe connection failed',
            error: error.message,
            stack: error.stack,
            keyInfo: {
                present: !!key,
                masked: maskedKey,
                length: key.length,
            }
        }, { status: 500 });
    }
}
