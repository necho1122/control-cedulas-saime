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
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

async function isAdminRequest() {
	const session = await getServerSession(authOptions);
	return session?.user?.role === 'Admin';
}

function normalizeText(value: unknown) {
	return String(value ?? '').trim();
}

function hasValidBody(
	carpeta: string,
	archivador: string,
	posicion: string,
	descripcion: string,
) {
	return Boolean(carpeta && archivador && posicion && descripcion);
}

export async function GET() {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

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
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const carpeta = normalizeText(body?.carpeta);
		const archivador = normalizeText(body?.archivador);
		const posicion = normalizeText(body?.posicion);
		const descripcion = normalizeText(body?.descripcion);

		if (!hasValidBody(carpeta, archivador, posicion, descripcion)) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 },
			);
		}

		const docRef = await addDoc(collection(db, 'organizacion'), {
			carpeta,
			archivador,
			posicion,
			descripcion,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		return NextResponse.json(
			{ id: docRef.id, carpeta, archivador, posicion, descripcion },
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error al crear la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const id = normalizeText(body?.id);
		const carpeta = normalizeText(body?.carpeta);
		const archivador = normalizeText(body?.archivador);
		const posicion = normalizeText(body?.posicion);
		const descripcion = normalizeText(body?.descripcion);

		if (!id || !hasValidBody(carpeta, archivador, posicion, descripcion)) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 },
			);
		}

		const docRef = doc(db, 'organizacion', id);
		await updateDoc(docRef, {
			carpeta,
			archivador,
			posicion,
			descripcion,
			updatedAt: new Date().toISOString(),
		});

		return NextResponse.json(
			{ id, carpeta, archivador, posicion, descripcion },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error al actualizar la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json(
				{ error: 'El ID es obligatorio' },
				{ status: 400 },
			);
		}

		const docRef = doc(db, 'organizacion', id);
		await deleteDoc(docRef);

		return NextResponse.json(
			{ message: 'Elemento eliminado' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error al eliminar la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}
