// @ts-nocheck
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getAdminDb } from '@/lib/firebase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, unit_price, quantity = 1, uid } = body;

    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Obtener credenciales dinámicas de la cuenta de vendedor conectada
    const db = getAdminDb();
    let accessToken = process.env.MP_ACCESS_TOKEN || 'APP_USR-2998921657503861-101010-0e8cbf5bf649b7417c9746f41441417f-71234678';
    let isMarketplaceConnected = false;

    if (db) {
      try {
        const mpSettingsSnap = await db.collection('system_settings').doc('mercadopago').get();
        if (mpSettingsSnap.exists && mpSettingsSnap.data()?.connected && mpSettingsSnap.data()?.seller_access_token) {
          accessToken = mpSettingsSnap.data().seller_access_token;
          isMarketplaceConnected = true;
        }
      } catch (err) {
        console.warn('Could not read MP system_settings, using fallback token:', err);
      }
    }

    const client = new MercadoPagoConfig({ 
      accessToken: accessToken,
      options: { timeout: 5000 } 
    });

    const preference = new Preference(client);

    const priceNum = Number(unit_price);
    const qtyNum = Number(quantity);
    const totalAmount = priceNum * qtyNum;

    // Calcular tarifa de plataforma (2%) si la cuenta está vinculada al Marketplace
    const preferencePayload: any = {
      items: [
        {
          id: "cash-brand-workshop",
          title: title || 'CASH & BRAND',
          unit_price: priceNum,
          quantity: qtyNum,
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
    };

    if (isMarketplaceConnected && totalAmount > 0) {
      // Tarifa de plataforma oficial: 3% por transacción (con precisión de 2 decimales para soportar pagos de prueba)
      const calculatedFee = Number((totalAmount * 0.03).toFixed(2));
      preferencePayload.marketplace_fee = Math.max(0.01, calculatedFee);
    }

    const result = await preference.create({
      body: preferencePayload
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
