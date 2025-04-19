import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id);
		await prisma.documento.delete({ where: { id } });
		return NextResponse.json(
			{ message: 'Documento eliminado' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al eliminar documento:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id);
		const { estado } = await request.json();
		await prisma.documento.update({
			where: { id },
			data: { estado },
		});
		return NextResponse.json(
			{ message: 'Estatus actualizado' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al actualizar estatus:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}
