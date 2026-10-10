import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-2998921657503861-101010-0e8cbf5bf649b7417c9746f41441417f-71234678',
  options: { timeout: 5000 } 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, unit_price, quantity = 1, uid } = body;

    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: "cash-brand-workshop",
            title: title || 'CASH & BRAND',
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            currency_id: 'ARS',
          }
        ],
        external_reference: uid,
        notification_url: `${baseUrl}/api/webhook`,
        back_urls: {
          success: `${baseUrl}/profile`,
          failure: `${baseUrl}`,
          pending: `${baseUrl}`
        },
        auto_return: 'approved'
      }
    });

    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point 
    });

  } catch (error: any) {
    console.error('Error creating preference:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
