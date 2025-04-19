'use client';

import { useEffect, useState } from 'react';

export default function Documentos() {
	const [documentos, setDocumentos] = useState([]);
	const [error, setError] = useState('');

	const fetchDocumentos = async () => {
		try {
			const res = await fetch('/api/documentos');
			if (!res.ok) throw new Error('Error al obtener documentos');
			const data = await res.json();
			setDocumentos(data);
		} catch (err: any) {
			setError(err.message);
		}
	};

	const cambiarEstatus = async (id: string, nuevoEstatus: string) => {
		try {
			const res = await fetch(`/api/documentos/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ estado: nuevoEstatus }),
			});
			if (!res.ok) throw new Error('Error al cambiar el estatus');
			fetchDocumentos(); // Refrescar la lista
		} catch (err: any) {
			setError(err.message);
		}
	};

	const eliminarDocumento = async (id: string) => {
		if (!confirm('¿Estás seguro de que deseas eliminar este documento?'))
			return;

		try {
			const res = await fetch(`/api/documentos/${id}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Error al eliminar el documento');
			fetchDocumentos(); // Refrescar la lista
		} catch (err: any) {
			setError(err.message);
		}
	};

	const obtenerSiguienteEstatus = (estatusActual: string) => {
		// Ciclo entre los estados: Disponible -> Entregado -> Extraviado -> Disponible
		if (estatusActual === 'Disponible') return 'Entregado';
		if (estatusActual === 'Entregado') return 'Extraviado';
		return 'Disponible';
	};

	useEffect(() => {
		fetchDocumentos();
	}, []);

	return (
		<div>
			<h1 className='text-3xl font-bold mb-4'>Gestión de Documentos</h1>
			{error && <p className='text-red-500'>{error}</p>}
			<table className='table-auto w-full border-collapse border border-gray-300'>
				<thead>
					<tr>
						<th className='border border-gray-300 px-4 py-2'>Nombre</th>
						<th className='border border-gray-300 px-4 py-2'>Cédula</th>
						<th className='border border-gray-300 px-4 py-2'>Estado</th>
						<th className='border border-gray-300 px-4 py-2'>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{documentos.map((doc: any) => (
						<tr key={doc.id}>
							<td className='border border-gray-300 px-4 py-2'>{doc.nombre}</td>
							<td className='border border-gray-300 px-4 py-2'>{doc.cedula}</td>
							<td className='border border-gray-300 px-4 py-2'>{doc.estado}</td>
							<td className='border border-gray-300 px-4 py-2'>
								<div className='flex gap-2'>
									<button
										className='bg-blue-500 text-white px-2 py-1'
										onClick={() =>
											cambiarEstatus(
												doc.id,
												obtenerSiguienteEstatus(doc.estado)
											)
										}
									>
										Cambiar Estatus
									</button>
									<button
										className='bg-red-500 text-white px-2 py-1'
										onClick={() => eliminarDocumento(doc.id)}
									>
										Eliminar
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
