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
      return NextResponse.json({ error: 'Firebase Admin Firestore no está disponible en el servidor' }, { status: 500 });
    }

    const snapshot = await db.collection('profiles').get();
    const users = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        ...data
      });
    });

    // Sort in memory by created_at descending
    users.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json({ error: 'Error del servidor: ' + (err.message || 'Desconocido') }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin Firestore no está disponible en el servidor' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { uid, has_paid } = body;
    if (!uid) {
      return NextResponse.json({ error: 'Falta el parámetro uid del usuario' }, { status: 400 });
    }

    await db.collection('profiles').doc(uid).update({
      has_paid: Boolean(has_paid),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating user payment:', err);
    return NextResponse.json({ error: 'Error al actualizar usuario: ' + (err.message || 'Desconocido') }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin Firestore no está disponible en el servidor' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ error: 'Falta el parámetro uid del alumno a eliminar' }, { status: 400 });
    }

    // Proteger contra eliminación de administradores principales
    const targetDoc = await db.collection('profiles').doc(uid).get();
    if (targetDoc.exists) {
      const targetEmail = (targetDoc.data()?.email || '').toLowerCase().trim();
      const protectedEmails = ['loggia.1996@gmail.com', 'brarecke@gmail.com', 'loggia.996@gmail.com'];
      if (protectedEmails.includes(targetEmail)) {
        return NextResponse.json({ error: 'No está permitido eliminar a un administrador del sistema' }, { status: 403 });
      }
    }

    // Eliminar perfil de Firestore
    await db.collection('profiles').doc(uid).delete();

    return NextResponse.json({ success: true, message: 'Alumno eliminado exitosamente' });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'Error al eliminar alumno: ' + (err.message || 'Desconocido') }, { status: 500 });
  }
}

