import { db } from '../../../firebaseConfig';
import {
	collection,
	doc,
	getDocs,
	limit,
	query,
	setDoc,
} from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

async function isAdminRequest() {
	const session = await getServerSession(authOptions);
	return session?.user?.role === 'Admin';
}

const defaultConfig = {
	idioma: 'es',
	zonaHoraria: 'UTC-4',
	formatoFecha: 'dd/mm/yyyy',
	nombreSistema: 'Sistema de Gestion de Cedulas',
	colorPrimario: '#1D4ED8',
	logo: '',
};

export async function GET() {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const configQuery = query(collection(db, 'configuracion'), limit(1));
		const snapshot = await getDocs(configQuery);

		if (snapshot.empty) {
			return NextResponse.json(defaultConfig, { status: 200 });
		}

		return NextResponse.json(snapshot.docs[0].data(), { status: 200 });
	} catch (error) {
		console.error('Error al obtener la configuración:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}

export async function PUT(request: Request) {
	if (!(await isAdminRequest())) {
		return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();

		const payload = {
			idioma: String(body?.idioma ?? defaultConfig.idioma),
			zonaHoraria: String(body?.zonaHoraria ?? defaultConfig.zonaHoraria),
			formatoFecha: String(body?.formatoFecha ?? defaultConfig.formatoFecha),
			nombreSistema: String(
				body?.nombreSistema ?? defaultConfig.nombreSistema,
			).trim(),
			colorPrimario: String(body?.colorPrimario ?? defaultConfig.colorPrimario),
			logo: String(body?.logo ?? ''),
			updatedAt: new Date().toISOString(),
		};

		const configRef = doc(db, 'configuracion', 'general');
		await setDoc(configRef, payload, { merge: true });

		return NextResponse.json(payload, { status: 200 });
	} catch (error) {
		console.error('Error al guardar la configuración:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		);
	}
}
