'use client';

import { useEffect, useState } from 'react';
import Contadores from './Contadores';

export default function Documentos() {
	const [documentos, setDocumentos] = useState([]);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(''); // Mensaje de éxito
	const [selectedEstados, setSelectedEstados] = useState<
		Record<string, string>
	>({}); // Estados seleccionados por documento

	const fetchDocumentos = async () => {
		try {
			const res = await fetch('/api/documentos');
			if (!res.ok) throw new Error('Error al obtener documentos');
			const data = await res.json();
			setDocumentos(data);
			// Inicializar estados seleccionados
			const estadosIniciales = data.reduce(
				(acc: Record<string, string>, doc: any) => {
					acc[doc.id] = doc.estado;
					return acc;
				},
				{}
			);
			setSelectedEstados(estadosIniciales);
		} catch (err: any) {
			setError(err.message);
			setTimeout(() => setError(''), 5000); // Ocultar mensaje después de 5 segundos
		}
	};

	const guardarEstatus = async (id: string) => {
		try {
			const nuevoEstatus = selectedEstados[id];
			const res = await fetch(`/api/documentos/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ estado: nuevoEstatus }),
			});
			if (!res.ok) throw new Error('Error al guardar el estatus');
			setSuccess('El estado se cambió correctamente.'); // Mostrar mensaje de éxito
			setError(''); // Limpiar errores
			setTimeout(() => setSuccess(''), 5000); // Ocultar mensaje después de 5 segundos
			fetchDocumentos(); // Refrescar la lista
		} catch (err: any) {
			setError(err.message);
			setSuccess(''); // Limpiar mensaje de éxito
			setTimeout(() => setError(''), 5000); // Ocultar mensaje después de 5 segundos
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
			setSuccess('El documento se eliminó correctamente.'); // Mostrar mensaje de éxito
			setError(''); // Limpiar errores
			setTimeout(() => setSuccess(''), 5000); // Ocultar mensaje después de 5 segundos
			fetchDocumentos(); // Refrescar la lista
		} catch (err: any) {
			setError(err.message);
			setSuccess(''); // Limpiar mensaje de éxito
			setTimeout(() => setError(''), 5000); // Ocultar mensaje después de 5 segundos
		}
	};

	useEffect(() => {
		fetchDocumentos();
	}, []);

	return (
		<div className='relative'>
			<h1 className='text-3xl font-bold mb-4'>Gestión de Documentos</h1>

			{/* Contadores */}
			<Contadores />

			{/* Notificaciones flotantes */}
			{success && (
				<div className='absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow'>
					{success}
				</div>
			)}
			{error && (
				<div className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow'>
					{error}
				</div>
			)}

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
							<td className='border border-gray-300 px-4 py-2'>
								<select
									value={selectedEstados[doc.id] || doc.estado}
									onChange={(e) =>
										setSelectedEstados({
											...selectedEstados,
											[doc.id]: e.target.value,
										})
									}
									className='border p-2'
								>
									<option value='Disponible'>Disponible</option>
									<option value='Entregado'>Entregado</option>
									<option value='Desincorporado'>Desincorporado</option>
								</select>
							</td>
							<td className='border border-gray-300 px-4 py-2'>
								<div className='flex gap-2'>
									<button
										className='bg-blue-500 text-white px-2 py-1'
										onClick={() => guardarEstatus(doc.id)}
									>
										Guardar Cambios
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
