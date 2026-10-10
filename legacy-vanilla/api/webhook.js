import { MercadoPagoConfig, Payment } from 'mercadopago';
import admin from 'firebase-admin';

// Initialize Firebase Admin securely
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Fix multiline private key from env var
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    })
  });
}
const db = admin.firestore();

// Initialize MP Config
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-2998921657503861-101010-0e8cbf5bf649b7417c9746f41441417f-71234678',
  options: { timeout: 5000 } 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { type, data, action } = req.body;
    
    // MP sends webhooks either as type="payment" and data.id=123, or action="payment.created" with data.id=123
    const paymentId = (data && data.id) || req.query['data.id'] || req.query.id;
    const eventType = type || req.query.type || action;

    if (!paymentId || (eventType !== 'payment' && !eventType?.startsWith('payment.'))) {
      return res.status(200).json({ message: 'Not a payment event, ignored.' });
    }

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
      const uid = paymentInfo.external_reference;
      
      // Update the user's profile securely using Firebase Admin
      await db.collection('profiles').doc(uid).update({
        has_paid: true,
        payment_id: paymentId,
        paid_at: new Date().toISOString()
      });

      console.log(`User ${uid} successfully granted access. Payment ID: ${paymentId}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
