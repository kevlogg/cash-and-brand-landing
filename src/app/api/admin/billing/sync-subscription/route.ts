import { NextResponse } from 'next/server';

// Token de cobro de Kevin Loggia (KevDev) - Collector ID: 322263721
const MP_ACCESS_TOKEN =
  process.env.KEVDEV_MP_ACCESS_TOKEN ||
  process.env.MP_MARKETPLACE_ACCESS_TOKEN ||
  'APP_USR-6048028823134972-082614-9caa0aa0e151104c1769457fec0a3bfa-322263721';

const KEVDEV_PAYMENTS_SECRET = process.env.KEVDEV_PAYMENTS_SECRET || 'kevdev_payments_sec_2026_key';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const preapprovalId = body.preapprovalId || body.id;

    if (!preapprovalId) {
      return NextResponse.json({ ok: false, error: 'Falta preapprovalId' }, { status: 400 });
    }

    // 1. Consultar estado en Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!mpRes.ok) {
      console.error('[SyncSubscription] Error fetching preapproval from MP:', mpRes.status);
      return NextResponse.json({ ok: false, error: 'No se pudo consultar la suscripción en MP' }, { status: 400 });
    }

    const preapproval = await mpRes.json();
    const isAuthorized = preapproval.status === 'authorized';

    // 2. Si está autorizado, sincronizar el pago inicial con el backend central de KevDev
    if (isAuthorized) {
      const today = new Date().toISOString().split('T')[0];
      const amount = preapproval.auto_recurring?.transaction_amount || 33000;

      try {
        const kevdevRes = await fetch('https://www.kevdev.net.ar/api/payments/receive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-kevdev-secret': KEVDEV_PAYMENTS_SECRET,
          },
          body: JSON.stringify({
            clienteId: 'brianrecke',
            monto: Number(amount),
            concepto: 'Cuota Mensual (Débito Automático)',
            fecha: today,
            medioPago: 'Mercado Pago (Débito Automático)',
            metodo: 'pasarela',
            referencia: preapprovalId,
            confirmado: true,
          }),
        });

        if (kevdevRes.ok) {
          console.log('[SyncSubscription] Pago inicial de suscripción registrado con éxito en KevDev');
        } else {
          const errData = await kevdevRes.text();
          console.warn('[SyncSubscription] KevDev receive response not ok:', errData);
        }
      } catch (kevErr) {
        console.error('[SyncSubscription] Error al contactar endpoint de KevDev:', kevErr);
      }
    }

    return NextResponse.json({
      ok: true,
      status: preapproval.status,
      isAuthorized,
      next_payment_date: preapproval.next_payment_date,
      date_created: preapproval.date_created,
    });
  } catch (err: any) {
    console.error('[SyncSubscription] Error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
