import { NextResponse } from 'next/server';

// Token oficial de Mercado Pago de Kevin Loggia (KevDev) - Collector ID: 322263721
// NO usar el token del vendedor (Brian Recke), ya que Brian es quien paga y Kevin quien cobra el plan.
const MP_ACCESS_TOKEN =
  process.env.KEVDEV_MP_ACCESS_TOKEN ||
  process.env.MP_MARKETPLACE_ACCESS_TOKEN ||
  'APP_USR-6048028823134972-082614-9caa0aa0e151104c1769457fec0a3bfa-322263721';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const isTest = Boolean(body.isTest);
    const payerEmail = (body.email || (isTest ? 'loggia.1996@gmail.com' : 'brarecke@gmail.com')).trim().toLowerCase();

    // Determinar la URL base de retorno (Mercado Pago requiere obligatoriamente HTTPS)
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'brianrecke.com';
    const isLocal = hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1');
    const baseUrl = isLocal ? 'https://brianrecke.com' : `https://${hostHeader}`;

    const backUrl = `${baseUrl}/admin?tab=plan&sub=success${isTest ? '&test=true' : ''}`;
    const notificationUrl = `${baseUrl}/api/admin/billing/webhook`;

    // Mercado Pago requiere un importe mínimo de $ 15 ARS para suscripciones con débito automático
    const transactionAmount = isTest ? 15 : 33000;
    const reason = isTest
      ? 'Plan KevDev - Pago de prueba ($10 / Test Kevin Loggia)'
      : 'Plan KevDev - Soporte y Mantenimiento Web (Brian Recke)';
    const externalReference = isTest ? 'test_plan_kevdev_loggia' : 'brianrecke_plan_kevdev';

    const payload = {
      payer_email: payerEmail,
      back_url: backUrl,
      notification_url: notificationUrl,
      reason,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: transactionAmount,
        currency_id: 'ARS',
      },
      external_reference: externalReference,
      status: 'pending',
    };

    const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      console.error('[Subscribe] Error creating Mercado Pago preapproval:', data);
      return NextResponse.json(
        { ok: false, error: data.message || 'Error al comunicarse con Mercado Pago' },
        { status: mpRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      init_point: data.init_point,
      status: data.status,
      next_payment_date: data.next_payment_date,
    });
  } catch (err: any) {
    console.error('[Subscribe] Unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
