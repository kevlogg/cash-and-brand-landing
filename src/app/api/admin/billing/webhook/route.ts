import { NextResponse } from 'next/server';

// Token de cobro de Kevin Loggia (KevDev) - Collector ID: 322263721
const MP_ACCESS_TOKEN =
  process.env.KEVDEV_MP_ACCESS_TOKEN ||
  process.env.MP_MARKETPLACE_ACCESS_TOKEN ||
  'APP_USR-6048028823134972-082614-9caa0aa0e151104c1769457fec0a3bfa-322263721';

const KEVDEV_PAYMENTS_SECRET = process.env.KEVDEV_PAYMENTS_SECRET || 'kevdev_payments_sec_2026_key';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    const eventType = body.type || body.action || url.searchParams.get('type') || '';
    const dataId = body?.data?.id || body?.id || url.searchParams.get('data.id') || url.searchParams.get('id');

    if (!dataId) {
      return NextResponse.json({ received: true, ignored: 'no data id' });
    }

    // 1. Si es un evento de pago (ej. cobro automático mensual ejecutado)
    if (eventType.includes('payment') || !eventType) {
      try {
        const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
          headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (paymentRes.ok) {
          const payment = await paymentRes.json();
          const extRef = payment.external_reference || '';
          const payerEmail = (payment.payer?.email || '').toLowerCase();
          const description = (payment.description || '').toLowerCase();

          const isBrianRecke =
            extRef.includes('brianrecke') ||
            payerEmail.includes('brarecke') ||
            description.includes('brian recke') ||
            description.includes('plan kevdev');

          if (isBrianRecke && payment.status === 'approved') {
            const dateStr = payment.date_approved
              ? new Date(payment.date_approved).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0];

            await fetch('https://www.kevdev.net.ar/api/payments/receive', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-kevdev-secret': KEVDEV_PAYMENTS_SECRET,
              },
              body: JSON.stringify({
                clienteId: 'brianrecke',
                monto: Number(payment.transaction_amount || 33000),
                concepto: 'Cuota Mensual (Débito Automático)',
                fecha: dateStr,
                medioPago: `Mercado Pago (${payment.payment_method_id || 'Tarjeta'})`,
                metodo: 'pasarela',
                referencia: String(payment.id),
                confirmado: true,
              }),
            });
            console.log(`[SubscriptionWebhook] Cobro recurrente ${payment.id} sincronizado exitosamente con KevDev`);
          }
        }
      } catch (payErr) {
        console.error('[SubscriptionWebhook] Error fetching payment:', payErr);
      }
    }

    // 2. Si es una actualización de la suscripción (subscription_preapproval)
    if (eventType.includes('subscription_preapproval') || eventType.includes('preapproval')) {
      try {
        const preRes = await fetch(`https://api.mercadopago.com/preapproval/${dataId}`, {
          headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
            'Cache-Control': 'no-cache',
          },
        });
        if (preRes.ok) {
          const subData = await preRes.json();
          console.log(`[SubscriptionWebhook] Preapproval ${dataId} status: ${subData.status}`);
        }
      } catch (subErr) {
        console.error('[SubscriptionWebhook] Error fetching preapproval in webhook:', subErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[SubscriptionWebhook] Global error:', err);
    return NextResponse.json({ received: true, error: err.message }, { status: 200 });
  }
}
