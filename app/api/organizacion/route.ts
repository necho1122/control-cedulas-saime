import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const organizacion = await prisma.organizacion.findMany();
		return NextResponse.json(organizacion, { status: 200 });
	} catch (error) {
		console.error('Error al obtener la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { carpeta, archivador, posicion, descripcion } = body;

		if (!carpeta || !archivador || !posicion || !descripcion) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		const nuevaOrganizacion = await prisma.organizacion.create({
			data: { carpeta, archivador, posicion, descripcion },
		});

		return NextResponse.json(nuevaOrganizacion, { status: 201 });
	} catch (error) {
		console.error('Error al crear la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const body = await request.json();
		const { id, carpeta, archivador, posicion, descripcion } = body;

		if (!id || !carpeta || !archivador || !posicion || !descripcion) {
			return NextResponse.json(
				{ error: 'Todos los campos son obligatorios' },
				{ status: 400 }
			);
		}

		const organizacionActualizada = await prisma.organizacion.update({
			where: { id },
			data: { carpeta, archivador, posicion, descripcion },
		});

		return NextResponse.json(organizacionActualizada, { status: 200 });
	} catch (error) {
		console.error('Error al actualizar la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = parseInt(searchParams.get('id') || '');

		if (!id) {
			return NextResponse.json(
				{ error: 'El ID es obligatorio' },
				{ status: 400 }
			);
		}

		await prisma.organizacion.delete({ where: { id } });

		return NextResponse.json(
			{ message: 'Elemento eliminado' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al eliminar la organización:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}
