import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('query');

		let usuarios;

		if (query) {
			// Buscar usuarios por nombre o número de cédula
			usuarios = await prisma.usuario.findMany({
				where: {
					OR: [
						{ email: { contains: query, mode: 'insensitive' } },
						{ rol: { contains: query, mode: 'insensitive' } },
					],
				},
			});
		} else {
			// Obtener todos los usuarios
			usuarios = await prisma.usuario.findMany();
		}

		return NextResponse.json(usuarios, { status: 200 });
	} catch (error) {
		console.error('Error al obtener usuarios:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}
