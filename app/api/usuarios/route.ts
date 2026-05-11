import { db } from '../../../firebaseConfig';
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
	query,
	where,
	limit,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '../../../lib/auth';

const ALLOWED_ROLES = new Set(['Admin', 'Usuario']);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function isAdminRequest() {
	const session = await getServerSession(authOptions);
	return session?.user?.role === 'Admin';
}

async function hasAnyUser() {
	const existingUsers = await getDocs(
		query(collection(db, 'usuarios'), limit(1)),
	);
	return !existingUsers.empty;
}

function sanitizeUser(docSnap: any) {
	const data = docSnap.data();
	return {
		id: docSnap.id,
		email: data.email,
		rol: data.rol,
		createdAt: data.createdAt ?? null,
		updatedAt: data.updatedAt ?? null,
	};
}

export async function GET() {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const querySnapshot = await getDocs(collection(db, 'usuarios'));
		const usuarios = querySnapshot.docs.map(sanitizeUser);

		return NextResponse.json(usuarios, { status: 200 });
	} catch (error: any) {
		console.error('Error al obtener los usuarios:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const [isAdmin, alreadyHasUsers] = await Promise.all([
		isAdminRequest(),
		hasAnyUser(),
	]);

	if (!isAdmin && alreadyHasUsers) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { email, password, rol } = body;
		const normalizedEmail = email?.trim()?.toLowerCase();

		if (!normalizedEmail || !password || !rol) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 },
			);
		}

		if (!emailRegex.test(normalizedEmail)) {
			return NextResponse.json(
				{ error: 'El correo no tiene un formato válido' },
				{ status: 400 },
			);
		}

		if (typeof password !== 'string' || password.length < 8) {
			return NextResponse.json(
				{ error: 'La contraseña debe tener al menos 8 caracteres' },
				{ status: 400 },
			);
		}

		if (!ALLOWED_ROLES.has(rol)) {
			return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
		}

		if (!alreadyHasUsers && rol !== 'Admin') {
			return NextResponse.json(
				{ error: 'El primer usuario del sistema debe ser Admin' },
				{ status: 400 },
			);
		}

		const userQuery = query(
			collection(db, 'usuarios'),
			where('email', '==', normalizedEmail),
			limit(1),
		);
		const existing = await getDocs(userQuery);
		if (!existing.empty) {
			return NextResponse.json(
				{ error: 'Ya existe un usuario con este correo' },
				{ status: 409 },
			);
		}

		const passwordHash = await bcrypt.hash(password, 12);
		const now = new Date().toISOString();

		// Crear un nuevo usuario en Firestore
		const docRef = await addDoc(collection(db, 'usuarios'), {
			email: normalizedEmail,
			passwordHash,
			password: null,
			rol,
			createdAt: now,
			updatedAt: now,
		});

		return NextResponse.json(
			{ id: docRef.id, email: normalizedEmail, rol },
			{ status: 201 },
		);
	} catch (error: any) {
		console.error('Error al crear el usuario:', error);
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
		const { id, email, password, rol } = body;
		const normalizedEmail = email?.trim()?.toLowerCase();

		if (!id || !normalizedEmail || !rol) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 },
			);
		}

		if (!emailRegex.test(normalizedEmail)) {
			return NextResponse.json(
				{ error: 'El correo no tiene un formato válido' },
				{ status: 400 },
			);
		}

		if (!ALLOWED_ROLES.has(rol)) {
			return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
		}

		const conflictQuery = query(
			collection(db, 'usuarios'),
			where('email', '==', normalizedEmail),
			limit(1),
		);
		const conflictDocs = await getDocs(conflictQuery);
		if (!conflictDocs.empty && conflictDocs.docs[0].id !== id) {
			return NextResponse.json(
				{ error: 'Ya existe un usuario con este correo' },
				{ status: 409 },
			);
		}

		const docRef = doc(db, 'usuarios', id);
		const payload: Record<string, any> = {
			email: normalizedEmail,
			rol,
			updatedAt: new Date().toISOString(),
		};

		if (password) {
			if (typeof password !== 'string' || password.length < 8) {
				return NextResponse.json(
					{ error: 'La contraseña debe tener al menos 8 caracteres' },
					{ status: 400 },
				);
			}
			payload.passwordHash = await bcrypt.hash(password, 12);
			payload.password = null;
		}

		await updateDoc(docRef, payload);

		return NextResponse.json(
			{ id, email: normalizedEmail, rol },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error('Error al actualizar el usuario:', error);
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

		const docRef = doc(db, 'usuarios', id);
		await deleteDoc(docRef);

		return NextResponse.json({ message: 'Usuario eliminado' }, { status: 200 });
	} catch (error: any) {
		console.error('Error al eliminar el usuario:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}
