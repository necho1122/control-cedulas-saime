'use client';

import { useState } from 'react';

export default function Configuracion() {
	const [parametros, setParametros] = useState({
		idioma: 'es',
		zonaHoraria: 'UTC-5',
		formatoFecha: 'dd/mm/yyyy',
	});
	const [personalizacion, setPersonalizacion] = useState({
		nombreSistema: 'Sistema de Gestión de Documentos',
		colorPrimario: '#1D4ED8',
		logo: null,
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleParametrosSubmit = (e) => {
		e.preventDefault();
		setSuccess('Parámetros del sistema actualizados correctamente.');
		setError('');
	};

	const handlePersonalizacionSubmit = (e) => {
		e.preventDefault();
		setSuccess('Personalización del sistema actualizada correctamente.');
		setError('');
	};

	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<div className='max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8'>
				<h1 className='text-3xl font-bold text-gray-800'>Configuración</h1>
				{error && <p className='text-red-500'>{error}</p>}
				{success && <p className='text-green-500'>{success}</p>}

				{/* Configuración de Parámetros del Sistema */}
				<section>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Configuración de Parámetros del Sistema
					</h2>
					<form
						onSubmit={handleParametrosSubmit}
						className='space-y-4'
					>
						<div>
							<label className='block text-gray-700'>Idioma</label>
							<select
								value={parametros.idioma}
								onChange={(e) =>
									setParametros({ ...parametros, idioma: e.target.value })
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
								value={parametros.zonaHoraria}
								onChange={(e) =>
									setParametros({ ...parametros, zonaHoraria: e.target.value })
								}
								className='border p-2 w-full'
							>
								<option value='UTC-5'>UTC-5</option>
								<option value='UTC-4'>UTC-4</option>
								<option value='UTC+0'>UTC+0</option>
							</select>
						</div>
						<div>
							<label className='block text-gray-700'>Formato de Fecha</label>
							<select
								value={parametros.formatoFecha}
								onChange={(e) =>
									setParametros({ ...parametros, formatoFecha: e.target.value })
								}
								className='border p-2 w-full'
							>
								<option value='dd/mm/yyyy'>dd/mm/yyyy</option>
								<option value='mm/dd/yyyy'>mm/dd/yyyy</option>
							</select>
						</div>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2'
						>
							Guardar Cambios
						</button>
					</form>
				</section>

				{/* Personalización del Sistema */}
				<section>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Personalización del Sistema
					</h2>
					<form
						onSubmit={handlePersonalizacionSubmit}
						className='space-y-4'
					>
						<div>
							<label className='block text-gray-700'>Nombre del Sistema</label>
							<input
								type='text'
								value={personalizacion.nombreSistema}
								onChange={(e) =>
									setPersonalizacion({
										...personalizacion,
										nombreSistema: e.target.value,
									})
								}
								className='border p-2 w-full'
							/>
						</div>
						<div>
							<label className='block text-gray-700'>Color Primario</label>
							<input
								type='color'
								value={personalizacion.colorPrimario}
								onChange={(e) =>
									setPersonalizacion({
										...personalizacion,
										colorPrimario: e.target.value,
									})
								}
								className='border p-2 w-full'
							/>
						</div>
						<div>
							<label className='block text-gray-700'>Logotipo</label>
							<input
								type='file'
								onChange={(e) =>
									setPersonalizacion({
										...personalizacion,
										logo: e.target.files[0],
									})
								}
								className='border p-2 w-full'
							/>
						</div>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2'
						>
							Guardar Cambios
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}
