import { db } from '../../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const queryParam = searchParams.get('query') || '';
		const filter = searchParams.get('filter') || '';

		// Referencia a la colección de Firestore
		let documentosRef = collection(db, 'documentos');

		// Construir la consulta
		let q;
		if (queryParam && filter) {
			q = query(
				documentosRef,
				where('tipoTramite', '==', filter),
				where('nombre', '>=', queryParam),
				where('nombre', '<=', queryParam + '\uf8ff')
			);
		} else if (queryParam) {
			q = query(
				documentosRef,
				where('nombre', '>=', queryParam),
				where('nombre', '<=', queryParam + '\uf8ff')
			);

			// Agregar búsqueda por cédula
			const cedulaQuery = query(
				documentosRef,
				where('cedula', '==', queryParam)
			);
			const [nombreSnapshot, cedulaSnapshot] = await Promise.all([
				getDocs(q),
				getDocs(cedulaQuery),
			]);

			const documentos = [
				...nombreSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
				...cedulaSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
			];

			return NextResponse.json(documentos, { status: 200 });
		} else if (filter) {
			q = query(documentosRef, where('tipoTramite', '==', filter));
		} else {
			q = documentosRef;
		}

		// Obtener los documentos
		const querySnapshot = await getDocs(q);
		const documentos = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return NextResponse.json(documentos, { status: 200 });
	} catch (error) {
		console.error(
			'Error al obtener los documentos:',
			error.message,
			error.stack
		);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}
