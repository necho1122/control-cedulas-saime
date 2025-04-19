import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validar los campos requeridos
		const {
			nombre,
			cedula,
			tipoTramite,
			fechaEmision,
			estado,
			carpeta,
			archivador,
			posicion,
		} = body;

		if (
			!nombre ||
			!cedula ||
			!tipoTramite ||
			!fechaEmision ||
			!estado ||
			!carpeta ||
			!archivador ||
			!posicion
		) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		// Crear un nuevo documento en la base de datos
		const nuevoDocumento = await prisma.documento.create({
			data: {
				nombre,
				cedula,
				tipoTramite,
				fechaEmision: new Date(fechaEmision), // Convertir a formato Date
				estado,
				carpeta,
				archivador,
				posicion,
			},
		});

		return NextResponse.json(nuevoDocumento, { status: 201 });
	} catch (error) {
		console.error('Error al registrar el documento:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}
