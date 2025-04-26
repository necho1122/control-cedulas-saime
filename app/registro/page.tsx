'use client';

import { useState } from 'react';

export default function Registro() {
	const [form, setForm] = useState({
		nombre: '',
		cedula: '',
		tipoTramite: 'Primera vez',
		fechaEmision: '',
		estado: 'Disponible',
		carpeta: '',
		archivador: '',
		posicion: '',
	});
	const [error, setError] = useState('');

	const handleFechaChange = (e) => {
		let value = e.target.value;

		// Eliminar cualquier carácter que no sea un número
		value = value.replace(/[^0-9]/g, '');

		// Agregar separadores `/` automáticamente
		if (value.length > 2 && value.length <= 4) {
			value = `${value.slice(0, 2)}/${value.slice(2)}`;
		} else if (value.length > 4) {
			value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
		}

		// Limitar la longitud máxima a 10 caracteres (dd/mm/yyyy)
		if (value.length > 10) {
			value = value.slice(0, 10);
		}

		// Validar días, meses y años
		const [day, month, year] = value.split('/');
		if (day && parseInt(day) > 31) {
			value = `31/${month || ''}${year ? `/${year}` : ''}`;
		}
		if (month && parseInt(month) > 12) {
			value = `${day || ''}/12${year ? `/${year}` : ''}`;
		}
		if (year && parseInt(year) > 9999) {
			value = `${day || ''}/${month || ''}/9999`;
		}

		setForm({ ...form, fechaEmision: value });
	};

	const isValidFecha = (fecha) => {
		const regex = /^\d{2}\/\d{2}\/\d{4}$/; // Validar formato dd/mm/yyyy
		return regex.test(fecha);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!isValidFecha(form.fechaEmision)) {
			setError('La fecha debe estar en el formato dd/mm/yyyy');
			return;
		}

		try {
			const res = await fetch('/api/registro', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (res.ok) {
				alert('Documento registrado con éxito');
				setForm({
					nombre: '',
					cedula: '',
					tipoTramite: 'Primera vez',
					fechaEmision: '',
					estado: 'Disponible',
					carpeta: '',
					archivador: '',
					posicion: '',
				});
			} else {
				const data = await res.json();
				setError(data.error || 'Error al registrar el documento');
			}
		} catch (err) {
			setError('No se pudo conectar con el servidor.');
		}
	};

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Registro de Documentos</h1>
			{error && <p className='text-red-500 mb-4'>{error}</p>}
			<form
				onSubmit={handleSubmit}
				className='space-y-4'
			>
				<input
					type='text'
					placeholder='Nombre completo'
					value={form.nombre}
					onChange={(e) => setForm({ ...form, nombre: e.target.value })}
					className='border p-2 w-full'
				/>
				<input
					type='text'
					placeholder='Número de cédula'
					value={form.cedula}
					onChange={(e) => {
						const value = e.target.value.replace(/[^0-9]/g, ''); // Permitir solo números
						setForm({ ...form, cedula: value });
					}}
					className='border p-2 w-full'
				/>
				<select
					value={form.tipoTramite}
					onChange={(e) => setForm({ ...form, tipoTramite: e.target.value })}
					className='border p-2 w-full'
				>
					<option value='Primera vez'>Primera vez</option>
					<option value='Renovación'>Renovación</option>
				</select>
				<input
					type='text'
					placeholder='Fecha de emisión (dd/mm/yyyy)'
					value={form.fechaEmision}
					onChange={handleFechaChange}
					className='border p-2 w-full'
				/>
				<select
					value={form.estado}
					onChange={(e) => setForm({ ...form, estado: e.target.value })}
					className='border p-2 w-full'
				>
					<option value='Disponible'>Disponible</option>
					<option value='Entregado'>Entregado</option>
					<option value='Extraviado'>Extraviado</option>
					<option value='Desincorporado'>Desincorporado</option>{' '}
					{/* Nuevo estado */}
				</select>
				<input
					type='text'
					placeholder='Carpeta'
					value={form.carpeta}
					onChange={(e) => setForm({ ...form, carpeta: e.target.value })}
					className='border p-2 w-full'
				/>
				<input
					type='text'
					placeholder='Archivador'
					value={form.archivador}
					onChange={(e) => setForm({ ...form, archivador: e.target.value })}
					className='border p-2 w-full'
				/>
				<input
					type='text'
					placeholder='Posición'
					value={form.posicion}
					onChange={(e) => setForm({ ...form, posicion: e.target.value })}
					className='border p-2 w-full'
				/>
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2'
				>
					Registrar
				</button>
			</form>
		</div>
	);
}
