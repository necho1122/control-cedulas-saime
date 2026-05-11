'use client';

import { useEffect, useState } from 'react';

type ConfiguracionPayload = {
	idioma: 'es' | 'en';
	zonaHoraria: string;
	formatoFecha: 'dd/mm/yyyy' | 'mm/dd/yyyy';
	nombreSistema: string;
	colorPrimario: string;
	logo: string;
};

export default function Configuracion() {
	const [config, setConfig] = useState<ConfiguracionPayload>({
		idioma: 'es',
		zonaHoraria: 'UTC-4',
		formatoFecha: 'dd/mm/yyyy',
		nombreSistema: 'Sistema de Gestion de Cedulas',
		colorPrimario: '#1D4ED8',
		logo: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const fetchConfiguracion = async () => {
		try {
			setIsLoading(true);
			const res = await fetch('/api/configuracion');
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error al cargar la configuración');
			}

			const data = await res.json();
			setConfig((prev) => ({ ...prev, ...data }));
			setError('');
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchConfiguracion();
	}, []);

	const handleSave = async (e) => {
		e.preventDefault();

		try {
			setIsSaving(true);
			const res = await fetch('/api/configuracion', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(config),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'No se pudo guardar la configuración');
			}

			setSuccess('Configuración actualizada correctamente.');
			setError('');
		} catch (err: any) {
			setError(err.message);
			setSuccess('');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<div className='max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8'>
				<h1 className='text-3xl font-bold text-gray-800'>Configuración</h1>
				{error && <p className='text-red-500'>{error}</p>}
				{success && <p className='text-green-500'>{success}</p>}
				{isLoading && (
					<p className='text-gray-600'>Cargando configuración...</p>
				)}

				{/* Configuración de Parámetros del Sistema */}
				<section>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Configuración de Parámetros del Sistema
					</h2>
					<form
						onSubmit={handleSave}
						className='space-y-4'
					>
						<div>
							<label className='block text-gray-700'>Idioma</label>
							<select
								value={config.idioma}
								onChange={(e) =>
									setConfig({
										...config,
										idioma: e.target.value as 'es' | 'en',
									})
								}
								className='border p-2 w-full'
							>
								<option value='es'>Español</option>
								<option value='en'>Inglés</option>
							</select>
						</div>
						<div>
							<label className='block text-gray-700'>Zona Horaria</label>
							<select
								value={config.zonaHoraria}
								onChange={(e) =>
									setConfig({ ...config, zonaHoraria: e.target.value })
								}
								className='border p-2 w-full'
							>
								<option value='UTC-4'>UTC-4</option>
								<option value='UTC-5'>UTC-5</option>
								<option value='UTC+0'>UTC+0</option>
							</select>
						</div>
						<div>
							<label className='block text-gray-700'>Formato de Fecha</label>
							<select
								value={config.formatoFecha}
								onChange={(e) =>
									setConfig({
										...config,
										formatoFecha: e.target.value as 'dd/mm/yyyy' | 'mm/dd/yyyy',
									})
								}
								className='border p-2 w-full'
							>
								<option value='dd/mm/yyyy'>dd/mm/yyyy</option>
								<option value='mm/dd/yyyy'>mm/dd/yyyy</option>
							</select>
						</div>
						<div>
							<label className='block text-gray-700'>Nombre del Sistema</label>
							<input
								type='text'
								value={config.nombreSistema}
								onChange={(e) =>
									setConfig({ ...config, nombreSistema: e.target.value })
								}
								className='border p-2 w-full'
							/>
						</div>
						<div>
							<label className='block text-gray-700'>Color Primario</label>
							<input
								type='color'
								value={config.colorPrimario}
								onChange={(e) =>
									setConfig({ ...config, colorPrimario: e.target.value })
								}
								className='border p-2 w-full'
							/>
						</div>
						<div>
							<label className='block text-gray-700'>URL del Logotipo</label>
							<input
								type='url'
								placeholder='https://...'
								value={config.logo}
								onChange={(e) => setConfig({ ...config, logo: e.target.value })}
								className='border p-2 w-full'
							/>
						</div>
						<button
							type='submit'
							disabled={isSaving || isLoading}
							className='bg-blue-500 text-white px-4 py-2 disabled:opacity-60'
						>
							{isSaving ? 'Guardando...' : 'Guardar Cambios'}
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}
