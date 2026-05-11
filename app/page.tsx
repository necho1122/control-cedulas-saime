'use client';

import { useEffect, useState } from 'react';

type Documento = {
	id: string;
	nombre: string;
	cedula: string;
	tipoTramite: 'Original' | 'Renovación';
	estado: 'Disponible' | 'Entregado' | 'Desincorporado';
	fechaEmision: string;
};

export default function Home() {
	const [documentos, setDocumentos] = useState<Documento[]>([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false); // Estado para controlar el indicador de carga
	const [hasSearched, setHasSearched] = useState(false);

	const fetchDocumentos = async (query = '', filter = '') => {
		setIsLoading(true); // Inicia el estado de carga
		try {
			const res = await fetch(
				`/api/documentos?query=${encodeURIComponent(
					query.trim(),
				)}&filter=${encodeURIComponent(filter)}&pageSize=100`,
			);
			if (!res.ok) {
				const payload = await res.json().catch(() => ({}));
				throw new Error(
					payload.details ||
						payload.error ||
						'Error al obtener la lista de documentos',
				);
			}
			const data = await res.json();
			setDocumentos(data);
			setError('');
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error inesperado');
		} finally {
			setIsLoading(false); // Finaliza el estado de carga
		}
	};

	useEffect(() => {
		fetchDocumentos();
	}, []);

	useEffect(() => {
		setHasSearched(true);
		fetchDocumentos(search, filter);
	}, [filter]);

	const handleSearch = () => {
		if (search.trim() || filter) {
			setError('');
			setHasSearched(true);
			fetchDocumentos(search, filter);
		} else {
			setError(
				'Por favor, ingresa un término de búsqueda válido o selecciona un filtro.',
			);
		}
	};

	const handleClear = () => {
		setSearch('');
		setFilter('');
		setHasSearched(false);
		setError('');
		fetchDocumentos('', '');
	};

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Documentos Registrados</h1>
			<div className='flex flex-col md:flex-row gap-2 mb-4'>
				<input
					type='text'
					placeholder='Buscar por nombre o cédula'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleSearch();
						}
					}}
					className='border p-2 flex-1'
				/>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className='border p-2'
				>
					<option value=''>Todos</option>
					<option value='Original'>Original</option>
					<option value='Renovación'>Renovación</option>
				</select>
				<button
					onClick={handleSearch}
					className='bg-blue-500 text-white px-4 py-2'
				>
					Buscar
				</button>
				<button
					onClick={handleClear}
					className='bg-gray-500 text-white px-4 py-2'
				>
					Limpiar
				</button>
			</div>
			<p className='text-sm text-gray-600 mb-3'>
				Mostrando {documentos.length} resultados.
			</p>
			{isLoading ? ( // Mostrar indicador de carga mientras se obtienen los datos
				<p className='text-blue-500'>Cargando datos...</p>
			) : error ? (
				<p className='text-red-500 mb-4'>{error}</p>
			) : documentos.length > 0 ? (
				<table className='table-auto w-full border-collapse border border-gray-300'>
					<thead>
						<tr className='bg-gray-200'>
							<th className='border border-gray-300 px-4 py-2'>Nombre</th>
							<th className='border border-gray-300 px-4 py-2'>Cédula</th>
							<th className='border border-gray-300 px-4 py-2'>
								Tipo de Trámite
							</th>
							{/* <th className='border border-gray-300 px-4 py-2'>Ubicación</th> */}
							<th className='border border-gray-300 px-4 py-2'>Estado</th>
							<th className='border border-gray-300 px-4 py-2'>
								Fecha de Emisión
							</th>
						</tr>
					</thead>
					<tbody>
						{documentos.map((doc) => (
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
								{/*
								<td className='border border-gray-300 px-4 py-2'>
									{doc.carpeta}, {doc.archivador}, {doc.posicion}
								</td>
								*/}
								<td className='border border-gray-300 px-4 py-2'>
									{doc.estado}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{new Date(doc.fechaEmision).toLocaleDateString('es-ES', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>
					{hasSearched
						? 'No se encontraron documentos con los filtros aplicados.'
						: 'No hay documentos registrados.'}
				</p>
			)}
		</div>
	);
}
