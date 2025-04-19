'use client';

import { useEffect, useState } from 'react';

export default function Home() {
	const [documentos, setDocumentos] = useState([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('');
	const [error, setError] = useState('');

	const fetchDocumentos = async (query = '', filter = '') => {
		try {
			const res = await fetch(
				`/api/documentos?query=${encodeURIComponent(
					query.trim()
				)}&filter=${encodeURIComponent(filter)}`
			);
			if (!res.ok) {
				throw new Error('Error al obtener la lista de documentos');
			}
			const data = await res.json();
			setDocumentos(data);
			setError('');
		} catch (err: any) {
			setError(err.message);
		}
	};

	useEffect(() => {
		fetchDocumentos();
	}, []);

	useEffect(() => {
		fetchDocumentos(search, filter);
	}, [filter]);

	const handleSearch = () => {
		if (search.trim() || filter) {
			setError('');
			fetchDocumentos(search, filter);
			setSearch(''); // Limpiar el input después de la búsqueda
		} else {
			setError(
				'Por favor, ingresa un término de búsqueda válido o selecciona un filtro.'
			);
		}
	};

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Documentos Registrados</h1>
			<div className='flex gap-2 mb-4'>
				<input
					type='text'
					placeholder='Buscar por nombre o cédula'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='border p-2 flex-1'
				/>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className='border p-2'
				>
					<option value=''>Todos</option>
					<option value='Primera vez'>Primera vez</option>
					<option value='Renovación'>Renovación</option>
				</select>
				<button
					onClick={handleSearch}
					className='bg-blue-500 text-white px-4 py-2'
				>
					Buscar
				</button>
			</div>
			{error && <p className='text-red-500 mb-4'>{error}</p>}
			<div>
				{documentos.length > 0 ? (
					<table className='table-auto w-full border-collapse border border-gray-300'>
						<thead>
							<tr className='bg-gray-200'>
								<th className='border border-gray-300 px-4 py-2'>Nombre</th>
								<th className='border border-gray-300 px-4 py-2'>Cédula</th>
								<th className='border border-gray-300 px-4 py-2'>
									Tipo de Trámite
								</th>
								<th className='border border-gray-300 px-4 py-2'>Ubicación</th>
								<th className='border border-gray-300 px-4 py-2'>Estado</th>
								<th className='border border-gray-300 px-4 py-2'>
									Fecha de Emisión
								</th>
							</tr>
						</thead>
						<tbody>
							{documentos.map((doc: any) => (
								<tr
									key={doc.id}
									className='text-center'
								>
									<td className='border border-gray-300 px-4 py-2'>
										{doc.nombre}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{doc.cedula}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{doc.tipoTramite}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{doc.carpeta}, {doc.archivador}, {doc.posicion}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{doc.estado}
									</td>
									<td className='border border-gray-300 px-4 py-2'>
										{new Date(doc.fechaEmision).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>No hay documentos registrados.</p>
				)}
			</div>
		</div>
	);
}
