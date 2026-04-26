import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getURL } from '@/utils/url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const baseUrl = getURL();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'NERV Pro Subscription',
              description: 'Cloud-hosted analysis, team dashboard, CI/CD integration',
            },
            unit_amount: 4900, // $49.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/access?canceled=true`,
      customer_email: email || undefined,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
