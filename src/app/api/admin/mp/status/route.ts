// @ts-nocheck
import { NextResponse } from 'next/server';
import { getAdminDb, verifyAdminRequest } from '@/lib/firebase/admin';

export async function GET(req: Request) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ connected: false });
    }

    const doc = await db.collection('system_settings').doc('mercadopago').get();
    if (doc.exists && doc.data()?.connected && doc.data()?.seller_access_token) {
      return NextResponse.json({ 
        connected: true,
        seller_id: doc.data().seller_id || null,
        connected_at: doc.data().connected_at || null
      });
    }

    return NextResponse.json({ connected: false });
  } catch (err: any) {
    console.error('Error checking MP status:', err);
    return NextResponse.json({ connected: false, error: err.message }, { status: 500 });
  }
}
