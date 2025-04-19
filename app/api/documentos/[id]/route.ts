import { db } from '../../../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const body = await request.json();
		const { estado } = body;

		if (!id || !estado) {
			return NextResponse.json(
				{ error: 'El ID del documento y el nuevo estado son obligatorios' },
				{ status: 400 }
			);
		}

		// Referencia al documento en Firestore
		const docRef = doc(db, 'documentos', id);

		// Actualizar el estado del documento
		await updateDoc(docRef, { estado });

		return NextResponse.json(
			{ message: 'Estado actualizado correctamente' },
			{ status: 200 }
		);
	} catch (error) {
		console.error(
			'Error al actualizar el estado del documento:',
			error.message,
			error.stack
		);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ error: 'El ID del documento es obligatorio' },
				{ status: 400 }
			);
		}

		// Referencia al documento en Firestore
		const docRef = doc(db, 'documentos', id);

		// Eliminar el documento
		await deleteDoc(docRef);

		return NextResponse.json(
			{ message: 'Documento eliminado correctamente' },
			{ status: 200 }
		);
	} catch (error) {
		console.error(
			'Error al eliminar el documento:',
			error.message,
			error.stack
		);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}
