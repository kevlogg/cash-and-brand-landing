// @ts-nocheck
import { NextResponse } from 'next/server';
import { getAdminDb, verifyAdminRequest, isUserAdmin } from '@/lib/firebase/admin';

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

    const callerUid = authCheck.uid;
    const callerEmail = (authCheck.email || '').toLowerCase().trim();

    snapshot.forEach(doc => {
      const data = doc.data() || {};
      const docEmail = (data.email || '').toLowerCase().trim();

      // Determinar si la cuenta pertenece a un administrador o al caller actual
      const isAdminAccount =
        doc.id === callerUid ||
        (docEmail && docEmail === callerEmail) ||
        isUserAdmin(data, docEmail);

      // Si es cuenta de administrador, garantizar que tenga su rol sincronizado
      if (isAdminAccount && (!data.is_admin || data.role !== 'admin')) {
        db.collection('profiles').doc(doc.id).set({
          is_admin: true,
          role: 'admin'
        }, { merge: true }).catch(err => console.warn('Could not sync admin flags:', err));
      }

      // Los administradores (Brian y equipo) NO deben listarse en la sección de alumnos
      if (!isAdminAccount) {
        users.push({
          id: doc.id,
          ...data
        });
      }
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

    const targetDoc = await db.collection('profiles').doc(uid).get();
    if (targetDoc.exists) {
      const targetData = targetDoc.data();
      if (isUserAdmin(targetData, targetData?.email)) {
        return NextResponse.json({ error: 'No está permitido modificar el estado de un administrador' }, { status: 400 });
      }
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

    // Proteger todas las cuentas de administrador
    const targetDoc = await db.collection('profiles').doc(uid).get();
    if (targetDoc.exists) {
      const targetData = targetDoc.data();
      if (isUserAdmin(targetData, targetData?.email)) {
        return NextResponse.json({ error: 'No está permitido eliminar cuentas de administrador' }, { status: 403 });
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

