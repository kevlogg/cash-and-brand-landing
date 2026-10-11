// @ts-nocheck
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'brianrecke.com';
  const adminUrl = `${protocol}://${host}/admin`;

  if (error || !code) {
    console.warn('Mercado Pago OAuth authorization denied or missing code:', error);
    return NextResponse.redirect(`${adminUrl}?mp_error=${encodeURIComponent(error || 'missing_code')}`);
  }

  try {
    const clientId = process.env.MP_MARKETPLACE_CLIENT_ID || '5679645126166390';
    const clientSecret = process.env.MP_MARKETPLACE_CLIENT_SECRET || '6aLpgSVKIoX6DUfihemWduf6Mi9trINV';
    const redirectUri = `https://brianrecke.com/api/admin/mp/callback`;

    const tokenRes = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok || !data.access_token) {
      console.error('Mercado Pago token exchange failed:', data);
      return NextResponse.redirect(`${adminUrl}?mp_error=token_exchange_failed`);
    }

    const db = getAdminDb();
    if (db) {
      await db.collection('system_settings').doc('mercadopago').set({
        connected: true,
        seller_id: data.user_id || null,
        seller_access_token: data.access_token,
        seller_public_key: data.public_key || null,
        refresh_token: data.refresh_token || null,
        token_type: data.token_type || 'bearer',
        expires_in: data.expires_in || null,
        scope: data.scope || null,
        connected_at: new Date().toISOString()
      }, { merge: true });
    }

    console.log('Mercado Pago account connected successfully. Seller ID:', data.user_id);
    return NextResponse.redirect(`${adminUrl}?mp_connected=true`);
  } catch (err: any) {
    console.error('Unexpected error in MP OAuth callback:', err);
    return NextResponse.redirect(`${adminUrl}?mp_error=server_error`);
  }
}
