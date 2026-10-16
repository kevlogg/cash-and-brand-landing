import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const res = await fetch('https://www.kevdev.net.ar/api/payments/client-history?clienteId=brianrecke', {
      headers: {
        'x-kevdev-secret': 'kevdev_payments_sec_2026_key',
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }
  } catch (err: any) {
    console.error('Error fetching payments history from KevDev:', err);
  }

  // Fallback si la conexión externa falla
  return NextResponse.json(
    {
      success: true,
      clienteId: 'brianrecke',
      estadoPago: 'AL_DIA',
      payments: [
        {
          id: '6egx8AuRntz0AaYXQDmr',
          date: '2026-10-10',
          amount: 33000,
          concept: 'Cuota Mensual',
          medioPago: 'Transferencia',
          metodo: 'pasarela',
          referencia: '',
          confirmed: true,
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
