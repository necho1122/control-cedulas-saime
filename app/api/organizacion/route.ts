import { db } from '../../../firebaseConfig';
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const querySnapshot = await getDocs(collection(db, 'organizacion'));
		const organizacion = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return NextResponse.json(organizacion, { status: 200 });
	} catch (error) {
		console.error('Error al obtener la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { carpeta, archivador, posicion, descripcion } = body;

		if (!carpeta || !archivador || !posicion || !descripcion) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		const docRef = await addDoc(collection(db, 'organizacion'), {
			carpeta,
			archivador,
			posicion,
			descripcion,
		});

		return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
	} catch (error) {
		console.error('Error al crear la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const body = await request.json();
		const { id, carpeta, archivador, posicion, descripcion } = body;

		if (!id || !carpeta || !archivador || !posicion || !descripcion) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		const docRef = doc(db, 'organizacion', id);
		await updateDoc(docRef, { carpeta, archivador, posicion, descripcion });

		return NextResponse.json(
			{ id, carpeta, archivador, posicion, descripcion },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al actualizar la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json(
				{ error: 'El ID es obligatorio' },
				{ status: 400 }
			);
		}

		const docRef = doc(db, 'organizacion', id);
		await deleteDoc(docRef);

		return NextResponse.json(
			{ message: 'Elemento eliminado' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al eliminar la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}
