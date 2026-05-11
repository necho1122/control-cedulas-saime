import { db } from '../../../firebaseConfig';
import {
	collection,
	addDoc,
	getDocs,
	limit,
	query,
	where,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

const ALLOWED_ESTADOS = new Set(['Disponible', 'Entregado', 'Desincorporado']);
const ALLOWED_TRAMITES = new Set(['Original', 'Renovación']);

function isValidDateParts(day: number, month: number, year: number) {
	if (year < 1900 || year > 9999) return false;
	if (month < 1 || month > 12) return false;
	if (day < 1 || day > 31) return false;

	const testDate = new Date(Date.UTC(year, month - 1, day));
	return (
		testDate.getUTCFullYear() === year &&
		testDate.getUTCMonth() === month - 1 &&
		testDate.getUTCDate() === day
	);
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();

		const { nombre, cedula, tipoTramite, fechaEmision, estado } = body;

		if (!nombre || !cedula || !tipoTramite || !fechaEmision || !estado) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 },
			);
		}

		const normalizedCedula = String(cedula).trim();
		if (!/^\d{6,10}$/.test(normalizedCedula)) {
			return NextResponse.json(
				{ error: 'La cédula debe contener solo números (6 a 10 dígitos)' },
				{ status: 400 },
			);
		}

		if (!ALLOWED_TRAMITES.has(tipoTramite)) {
			return NextResponse.json(
				{ error: 'Tipo de trámite inválido' },
				{ status: 400 },
			);
		}

		if (!ALLOWED_ESTADOS.has(estado)) {
			return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
		}

		// Validar formato de fecha dd/mm/yyyy
		const fechaValida = /^\d{2}\/\d{2}\/\d{4}$/.test(fechaEmision);
		if (!fechaValida) {
			return NextResponse.json(
				{ error: 'El formato de la fecha debe ser dd/mm/yyyy' },
				{ status: 400 },
			);
		}

		const [day, month, year] = fechaEmision.split('/');
		const dayNum = parseInt(day, 10);
		const monthNum = parseInt(month, 10);
		const yearNum = parseInt(year, 10);

		if (!isValidDateParts(dayNum, monthNum, yearNum)) {
			return NextResponse.json(
				{ error: 'La fecha proporcionada no es válida' },
				{ status: 400 },
			);
		}

		const duplicatedCedulaQuery = query(
			collection(db, 'documentos'),
			where('cedula', '==', normalizedCedula),
			limit(1),
		);
		const existing = await getDocs(duplicatedCedulaQuery);
		if (!existing.empty) {
			return NextResponse.json(
				{ error: 'Ya existe un documento registrado para esta cédula' },
				{ status: 409 },
			);
		}

		const fechaIsoUtc = new Date(
			Date.UTC(yearNum, monthNum - 1, dayNum, 12, 0, 0),
		).toISOString();
		const now = new Date().toISOString();

		// Crear un nuevo documento en Firestore
		const docRef = await addDoc(collection(db, 'documentos'), {
			nombre: String(nombre).trim(),
			cedula: normalizedCedula,
			tipoTramite,
			fechaEmision: fechaIsoUtc,
			estado,
			createdAt: now,
			updatedAt: now,
			createdBy: session.user.id,
		});

		return NextResponse.json(
			{
				id: docRef.id,
				nombre: String(nombre).trim(),
				cedula: normalizedCedula,
				tipoTramite,
				fechaEmision: fechaIsoUtc,
				estado,
			},
			{ status: 201 },
		);
	} catch (error: any) {
		console.error('Error al registrar el documento:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}
