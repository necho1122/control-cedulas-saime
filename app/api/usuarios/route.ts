import { db } from '../../../firebaseConfig';
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const querySnapshot = await getDocs(collection(db, 'usuarios'));
		const usuarios = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return NextResponse.json(usuarios, { status: 200 });
	} catch (error) {
		console.error('Error al obtener los usuarios:', error.message, error.stack);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password, rol } = body;

		if (!email || !password || !rol) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		// Crear un nuevo usuario en Firestore
		const docRef = await addDoc(collection(db, 'usuarios'), {
			email,
			password,
			rol,
		});

		return NextResponse.json({ id: docRef.id, email, rol }, { status: 201 });
	} catch (error) {
		console.error('Error al crear el usuario:', error.message, error.stack);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const body = await request.json();
		const { id, email, password, rol } = body;

		if (!id || !email || !password || !rol) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		const docRef = doc(db, 'usuarios', id);
		await updateDoc(docRef, { email, password, rol });

		return NextResponse.json({ id, email, rol }, { status: 200 });
	} catch (error) {
		console.error(
			'Error al actualizar el usuario:',
			error.message,
			error.stack
		);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
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

		const docRef = doc(db, 'usuarios', id);
		await deleteDoc(docRef);

		return NextResponse.json({ message: 'Usuario eliminado' }, { status: 200 });
	} catch (error) {
		console.error('Error al eliminar el usuario:', error.message, error.stack);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}
