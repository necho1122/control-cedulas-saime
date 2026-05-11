import { db } from '../../../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

const ALLOWED_ESTADOS = new Set(['Disponible', 'Entregado', 'Desincorporado']);

async function isAdminRequest() {
	const session = await getServerSession(authOptions);
	return session?.user?.role === 'Admin';
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } },
) {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const { id } = params;
		const body = await request.json();
		const estado = body?.estado?.trim();

		if (!id || !estado) {
			return NextResponse.json(
				{ error: 'El ID del documento y el nuevo estado son obligatorios' },
				{ status: 400 },
			);
		}

		if (!ALLOWED_ESTADOS.has(estado)) {
			return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
		}

		// Referencia al documento en Firestore
		const docRef = doc(db, 'documentos', id);

		// Actualizar el estado del documento
		await updateDoc(docRef, {
			estado,
			updatedAt: new Date().toISOString(),
		});

		return NextResponse.json(
			{ message: 'Estado actualizado correctamente' },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error('Error al actualizar el estado del documento:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ error: 'El ID del documento es obligatorio' },
				{ status: 400 },
			);
		}

		// Referencia al documento en Firestore
		const docRef = doc(db, 'documentos', id);

		// Eliminar el documento
		await deleteDoc(docRef);

		return NextResponse.json(
			{ message: 'Documento eliminado correctamente' },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error('Error al eliminar el documento:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}
