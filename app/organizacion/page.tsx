'use client';

import { useEffect, useState } from 'react';

type OrganizacionItem = {
	id: string;
	carpeta: string;
	archivador: string;
	posicion: string;
	descripcion: string;
};

type OrganizacionForm = {
	id: string | null;
	carpeta: string;
	archivador: string;
	posicion: string;
	descripcion: string;
};

export default function Organizacion() {
	const [organizacion, setOrganizacion] = useState<OrganizacionItem[]>([]);
	const [form, setForm] = useState<OrganizacionForm>({
		id: null,
		carpeta: '',
		archivador: '',
		posicion: '',
		descripcion: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const fetchOrganizacion = async () => {
		try {
			const res = await fetch('/api/organizacion');
			if (!res.ok) throw new Error('Error al obtener la organización');
			const data = await res.json();
			setOrganizacion(data);
			setError('');
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		try {
			const method = form.id ? 'PATCH' : 'POST';
			const res = await fetch('/api/organizacion', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (!res.ok) throw new Error('Error al guardar los datos');
			setForm({
				id: null,
				carpeta: '',
				archivador: '',
				posicion: '',
				descripcion: '',
			});
			setSuccess(form.id ? 'Registro actualizado.' : 'Registro agregado.');
			fetchOrganizacion();
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleEdit = (item: OrganizacionItem) => {
		setForm(item);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

		try {
			const res = await fetch(`/api/organizacion?id=${id}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Error al eliminar el elemento');
			setSuccess('Elemento eliminado.');
			fetchOrganizacion();
		} catch (err: any) {
			setError(err.message);
		}
	};

	useEffect(() => {
		fetchOrganizacion();
	}, []);

	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Organización de Documentos
				</h1>
				{error && <p className='text-red-500 mb-4'>{error}</p>}
				{success && <p className='text-green-600 mb-4'>{success}</p>}
				<form
					onSubmit={handleSubmit}
					className='mb-8 space-y-4'
				>
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
					<input
						type='text'
						placeholder='Descripción'
						value={form.descripcion}
						onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
						className='border p-2 w-full'
					/>
					<button
						type='submit'
						className='bg-blue-500 text-white px-4 py-2'
					>
						{form.id ? 'Actualizar' : 'Agregar'}
					</button>
				</form>
				<table className='table-auto w-full border-collapse border border-gray-300'>
					<thead>
						<tr>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Carpeta
							</th>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Archivador
							</th>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Posición
							</th>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Descripción
							</th>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{organizacion.map((item: OrganizacionItem) => (
							<tr key={item.id}>
								<td className='border border-gray-300 px-4 py-2'>
									{item.carpeta}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{item.archivador}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{item.posicion}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{item.descripcion}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									<div className='flex space-x-2'>
										<button
											className='bg-yellow-500 text-white px-2 py-1'
											onClick={() => handleEdit(item)}
										>
											Editar
										</button>
										<button
											className='bg-red-500 text-white px-2 py-1'
											onClick={() => handleDelete(item.id)}
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
		</div>
	);
}
