import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export const dynamic = 'force-dynamic'; // Marcar el endpoint como dinámico

type FirestoreValue = {
	stringValue?: string;
	integerValue?: string;
	doubleValue?: number;
	booleanValue?: boolean;
	nullValue?: null;
	timestampValue?: string;
	mapValue?: { fields?: Record<string, FirestoreValue> };
	arrayValue?: { values?: FirestoreValue[] };
};

type FirestoreDocument = {
	name: string;
	fields?: Record<string, FirestoreValue>;
};

type DocumentoData = {
	id: string;
	[key: string]: unknown;
};

function decodeFirestoreValue(value: FirestoreValue): unknown {
	if (value.stringValue !== undefined) return value.stringValue;
	if (value.integerValue !== undefined) return Number(value.integerValue);
	if (value.doubleValue !== undefined) return value.doubleValue;
	if (value.booleanValue !== undefined) return value.booleanValue;
	if (value.timestampValue !== undefined) return value.timestampValue;
	if (value.nullValue !== undefined) return null;

	if (value.mapValue?.fields) {
		const mapped: Record<string, unknown> = {};
		for (const [key, child] of Object.entries(value.mapValue.fields)) {
			mapped[key] = decodeFirestoreValue(child);
		}
		return mapped;
	}

	if (value.arrayValue?.values) {
		return value.arrayValue.values.map((item) => decodeFirestoreValue(item));
	}

	return null;
}

function decodeFields(fields?: Record<string, FirestoreValue>) {
	const data: Record<string, unknown> = {};
	if (!fields) return data;

	for (const [key, value] of Object.entries(fields)) {
		data[key] = decodeFirestoreValue(value);
	}

	return data;
}

function getDocIdFromName(name: string) {
	const parts = name.split('/');
	return parts[parts.length - 1] || '';
}

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const firebaseIdToken = session.firebaseIdToken;
		if (!firebaseIdToken) {
			return NextResponse.json(
				{ error: 'Sesión sin token de Firebase. Inicia sesión nuevamente.' },
				{ status: 401 },
			);
		}

		const projectId =
			process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
			process.env.FIREBASE_PROJECT_ID;
		if (!projectId) {
			return NextResponse.json(
				{ error: 'Falta NEXT_PUBLIC_FIREBASE_PROJECT_ID en entorno.' },
				{ status: 500 },
			);
		}

		const { searchParams } = new URL(request.url); // Usar URL para obtener los parámetros de consulta
		const queryParam = (searchParams.get('query') || '').trim();
		const filter = searchParams.get('filter') || '';
		const pageSizeParam = parseInt(searchParams.get('pageSize') || '100', 10);
		const pageSize = Number.isNaN(pageSizeParam)
			? 100
			: Math.min(Math.max(pageSizeParam, 1), 200);

		const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/documentos?pageSize=${pageSize}`;

		const response = await fetch(endpoint, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${firebaseIdToken}`,
			},
		});

		const payload = await response.json();
		if (!response.ok) {
			const details =
				payload?.error?.message || 'No se pudo consultar Firestore.';
			return NextResponse.json(
				{ error: 'Error al obtener los documentos', details },
				{ status: response.status },
			);
		}

		const allDocuments: DocumentoData[] = (
			(payload?.documents || []) as FirestoreDocument[]
		).map((doc) => ({
			id: getDocIdFromName(doc.name),
			...decodeFields(doc.fields),
		}));

		const normalizedQuery = queryParam.toLowerCase();
		let documentosFiltrados = allDocuments;

		if (filter) {
			documentosFiltrados = documentosFiltrados.filter(
				(doc) => String(doc.tipoTramite || '') === filter,
			);
		}

		if (queryParam) {
			const matchedByName = documentosFiltrados.filter((doc) =>
				String(doc.nombre || '')
					.toLowerCase()
					.startsWith(normalizedQuery),
			);

			const matchedByCedula = documentosFiltrados.filter(
				(doc) => String(doc.cedula || '') === queryParam,
			);

			documentosFiltrados = Array.from(
				new Map(
					[...matchedByName, ...matchedByCedula].map((doc) => [doc.id, doc]),
				).values(),
			);
		}

		documentosFiltrados = documentosFiltrados
			.sort((a, b) => {
				const left = String(a.createdAt || '');
				const right = String(b.createdAt || '');
				return right.localeCompare(left);
			})
			.slice(0, pageSize);

		return NextResponse.json(documentosFiltrados, { status: 200 });
	} catch (error: any) {
		console.error('Error al obtener los documentos:', error);
		return NextResponse.json(
			{
				error: 'Error interno del servidor',
				details: error?.message ?? 'unknown',
			},
			{ status: 500 },
		);
	}
}
