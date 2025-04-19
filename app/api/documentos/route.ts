import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('query') || '';
		const filter = searchParams.get('filter') || '';

		console.log('Query:', query);
		console.log('Filter:', filter);

		let documentos;

		if (query.trim()) {
			documentos = await prisma.documento.findMany({
				where: {
					OR: [
						{ nombre: { contains: query } },
						{ cedula: { equals: query } }, // Cambiado de `contains` a `equals`
					],
					...(filter && { tipoTramite: filter }),
				},
			});
		} else if (filter) {
			documentos = await prisma.documento.findMany({
				where: {
					tipoTramite: filter,
				},
			});
		} else {
			documentos = await prisma.documento.findMany();
		}

		return NextResponse.json(documentos, { status: 200 });
	} catch (error) {
		console.error('Error al obtener documentos:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}
