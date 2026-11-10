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

    // Determinar la URL base de retorno (Mercado Pago requiere obligatoriamente HTTPS)
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'brianrecke.com';
    const isLocal = hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1');
    const baseUrl = isLocal ? 'https://brianrecke.com' : `https://${hostHeader}`;

    // =========================================================================
    // CASO A: PAGO DE PRUEBA ($ 10) - PAGO ÚNICO (NO RECURRENTE)
    // Para probar la visualización de la pasarela sin generar cobros mensuales.
    // =========================================================================
    if (isTest) {
      const prefPayload = {
        items: [
          {
            id: 'test-kevdev-10',
            title: 'Pago de prueba ($ 10) - KevDev',
            description: 'Prueba de pago único de $ 10 ARS (Checkout Pro)',
            quantity: 1,
            unit_price: 10,
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: 'loggia.1996@gmail.com',
        },
        back_urls: {
          success: `${baseUrl}/admin?tab=plan&test=success`,
          failure: `${baseUrl}/admin?tab=plan&test=failure`,
          pending: `${baseUrl}/admin?tab=plan&test=pending`,
        },
        auto_return: 'approved',
        external_reference: 'test_pago_unico_10',
      };

      const prefRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prefPayload),
      });

      const prefData = await prefRes.json();

      if (!prefRes.ok) {
        console.error('[Subscribe:Test] Error creating test preference in MP:', prefData);
        return NextResponse.json(
          { ok: false, error: prefData.message || 'Error al generar la preferencia de prueba' },
          { status: prefRes.status }
        );
      }

      return NextResponse.json({
        ok: true,
        isTest: true,
        id: prefData.id,
        init_point: prefData.init_point,
      });
    }

    // =========================================================================
    // CASO B: PLAN REAL BRIAN RECKE ($ 33.000) - SUSCRIPCIÓN CON DÉBITO AUTOMÁTICO
    // Primer pago hoy + cobro automático mensual cada día 10.
    // =========================================================================
    const payerEmail = (body.email || 'brarecke@gmail.com').trim().toLowerCase();

    // 1. Verificación de seguridad: comprobar si ya existe una suscripción activa para evitar cobros duplicados
    try {
      const searchRes = await fetch(`https://api.mercadopago.com/preapproval/search?payer_email=${encodeURIComponent(payerEmail)}`, {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Cache-Control': 'no-cache',
        },
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const activeSub = (searchData.results || []).find((r: any) => r.status === 'authorized');
        if (activeSub) {
          return NextResponse.json(
            { ok: false, error: 'Ya cuentas con una suscripción de débito automático activa para este plan.' },
            { status: 400 }
          );
        }
      }
    } catch (checkErr) {
      console.warn('[Subscribe] Could not verify existing subscriptions:', checkErr);
    }

    // 2. Crear la suscripción recurrente en Mercado Pago
    const backUrl = `${baseUrl}/admin?tab=plan&sub=success`;
    const notificationUrl = `${baseUrl}/api/admin/billing/webhook`;

    const subPayload = {
      payer_email: payerEmail,
      back_url: backUrl,
      notification_url: notificationUrl,
      reason: 'Plan KevDev - Soporte y Mantenimiento Web (Brian Recke)',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 33000,
        currency_id: 'ARS',
      },
      external_reference: 'brianrecke_plan_kevdev',
      status: 'pending',
    };

    const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subPayload),
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
      isTest: false,
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
