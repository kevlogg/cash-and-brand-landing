import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuración del Access Token de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-2998921657503861-101010-0e8cbf5bf649b7417c9746f41441417f-71234678',
  options: { timeout: 5000 } 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { title, unit_price, quantity = 1, uid } = req.body;

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: title || 'CASH & BRAND',
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            currency_id: 'ARS',
          }
        ],
        external_reference: uid,
        notification_url: `${baseUrl}/api/webhook`,
        back_urls: {
          success: `${baseUrl}/profile.html`,
          failure: `${baseUrl}`,
          pending: `${baseUrl}`
        },
        auto_return: 'approved'
      }
    });

    res.status(200).json({ 
      id: result.id, 
      init_point: result.init_point 
    });

  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
