'use client';

import { useEffect, useState } from 'react';

export default function Contadores() {
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

	useEffect(() => {
		fetchDocumentos();
	}, []);

	// Contar documentos por tipo de trámite
	const contarPorTipoTramite = (tipo: string) =>
		documentos.filter((doc: any) => doc.tipoTramite === tipo).length;

	// Contar documentos por estatus
	const contarPorEstatus = (estatus: string) =>
		documentos.filter((doc: any) => doc.estado === estatus).length;

	return (
		<div className='p-4 bg-gray-100 rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>Resumen de Documentos</h2>
			{error && <p className='text-red-500'>{error}</p>}
			<div className='grid grid-cols-2 gap-4'>
				{/* Contadores por tipo de trámite */}
				<div className='bg-white p-4 rounded shadow'>
					<h3 className='text-lg font-semibold mb-2'>Por Tipo de Trámite</h3>
					<ul>
						<li>Original: {contarPorTipoTramite('Original')}</li>
						<li>Renovación: {contarPorTipoTramite('Renovación')}</li>
					</ul>
				</div>

				{/* Contadores por estatus */}
				<div className='bg-white p-4 rounded shadow'>
					<h3 className='text-lg font-semibold mb-2'>Por Estatus</h3>
					<ul>
						<li>Disponible: {contarPorEstatus('Disponible')}</li>
						<li>Entregado: {contarPorEstatus('Entregado')}</li>
						<li>Desincorporado: {contarPorEstatus('Desincorporado')}</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
