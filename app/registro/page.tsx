'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

type FormState = {
	nombre: string;
	cedula: string;
	tipoTramite: 'Original' | 'Renovación';
	fechaEmision: string;
	estado: 'Disponible' | 'Entregado' | 'Desincorporado';
};

export default function Registro() {
	const [form, setForm] = useState<FormState>({
		nombre: '',
		cedula: '',
		tipoTramite: 'Original',
		fechaEmision: '',
		estado: 'Disponible',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFechaChange = (e: ChangeEvent<HTMLInputElement>) => {
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

	const isValidFecha = (fecha: string) => {
		const regex = /^\d{2}\/\d{2}\/\d{4}$/; // Validar formato dd/mm/yyyy
		return regex.test(fecha);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!isValidFecha(form.fechaEmision)) {
			setError('La fecha debe estar en el formato dd/mm/yyyy');
			return;
		}

		try {
			setIsSubmitting(true);
			const res = await fetch('/api/registro', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (res.ok) {
				setSuccess('Documento registrado con éxito.');
				setForm({
					nombre: '',
					cedula: '',
					tipoTramite: 'Original',
					fechaEmision: '',
					estado: 'Disponible',
				});
			} else {
				const data = await res.json();
				setError(data.error || 'Error al registrar el documento');
			}
		} catch (err) {
			setError('No se pudo conectar con el servidor.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Registro de Documentos</h1>
			{error && <p className='text-red-500 mb-4'>{error}</p>}
			{success && <p className='text-green-600 mb-4'>{success}</p>}
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
					onChange={(e) =>
						setForm({
							...form,
							tipoTramite: e.target.value as 'Original' | 'Renovación',
						})
					}
					className='border p-2 w-full'
				>
					<option value='Original'>Original</option>
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
					onChange={(e) =>
						setForm({
							...form,
							estado: e.target.value as
								| 'Disponible'
								| 'Entregado'
								| 'Desincorporado',
						})
					}
					className='border p-2 w-full'
				>
					<option value='Disponible'>Disponible</option>
					<option value='Entregado'>Entregado</option>
					<option value='Desincorporado'>Desincorporado</option>
				</select>
				{/* <input
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
				/>*/}
				<button
					type='submit'
					disabled={isSubmitting}
					className='bg-blue-500 text-white px-4 py-2 disabled:opacity-60'
				>
					{isSubmitting ? 'Guardando...' : 'Registrar'}
				</button>
			</form>
		</div>
	);
}
