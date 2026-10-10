// @ts-nocheck
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getDb() {
  if (!getApps().length) {
    // Si no hay variables de entorno (ej: en build time en Vercel sin vars), no inicializar para no crashear el build
    if (process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      });
    }
  }
  return getApps().length ? getFirestore() : null;
}

// Initialize MP Config
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-2998921657503861-101010-0e8cbf5bf649b7417c9746f41441417f-71234678',
  options: { timeout: 5000 } 
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let body;
    try {
      body = await req.json();
    } catch(e) {
      body = {};
    }

    const { type, data, action } = body;
    
    // MP sends webhooks either as type="payment" and data.id=123, or action="payment.created" with data.id=123
    const paymentId = (data && data.id) || searchParams.get('data.id') || searchParams.get('id');
    const eventType = type || searchParams.get('type') || action;

    if (!paymentId || (eventType !== 'payment' && !eventType?.startsWith('payment.'))) {
      return NextResponse.json({ message: 'Not a payment event, ignored.' });
    }

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
      const uid = paymentInfo.external_reference;
      
      const db = getDb();
      if (db) {
        // Update the user's profile securely using Firebase Admin
        await db.collection('profiles').doc(uid).update({
          has_paid: true,
          payment_id: paymentId,
          paid_at: new Date().toISOString()
        });
      }

      console.log(`User ${uid} successfully granted access. Payment ID: ${paymentId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
