import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const { nombre, cedula, tipoTramite, fechaEmision, estado } = body;

		if (!nombre || !cedula || !tipoTramite || !fechaEmision || !estado) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		// Validar formato de fecha dd/mm/yyyy
		const fechaValida = /^\d{2}\/\d{2}\/\d{4}$/.test(fechaEmision);
		if (!fechaValida) {
			return NextResponse.json(
				{ error: 'El formato de la fecha debe ser dd/mm/yyyy' },
				{ status: 400 }
			);
		}

		// Convertir fecha a objeto Date
		const [day, month, year] = fechaEmision.split('/');
		const fecha = new Date(`${year}-${month}-${day}`);
		if (isNaN(fecha.getTime())) {
			return NextResponse.json(
				{ error: 'La fecha proporcionada no es válida' },
				{ status: 400 }
			);
		}

		// Crear un nuevo documento en Firestore
		const docRef = await addDoc(collection(db, 'documentos'), {
			nombre,
			cedula,
			tipoTramite,
			fechaEmision: fecha.toISOString(),
			estado,
		});

		return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
	} catch (error) {
		console.error(
			'Error al registrar el documento:',
			error.message,
			error.stack
		);
		return NextResponse.json(
			{ error: 'Error interno del servidor', details: error.message },
			{ status: 500 }
		);
	}
}
