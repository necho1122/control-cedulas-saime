'use client';

import { useEffect, useState } from 'react';

export default function Usuarios() {
	const [usuarios, setUsuarios] = useState([]);
	const [form, setForm] = useState({
		id: null,
		email: '',
		password: '',
		rol: '',
	});
	const [error, setError] = useState('');

	const fetchUsuarios = async () => {
		try {
			const res = await fetch('/api/usuarios');
			if (!res.ok) throw new Error('Error al obtener usuarios');
			const data = await res.json();
			setUsuarios(data);
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		try {
			const method = form.id ? 'PATCH' : 'POST';
			const res = await fetch('/api/usuarios', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (!res.ok) throw new Error('Error al guardar los datos');
			setForm({ id: null, email: '', password: '', rol: '' });
			fetchUsuarios();
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleEdit = (item) => {
		setForm(item);
	};

	const handleDelete = async (id) => {
		if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

		try {
			const res = await fetch(`/api/usuarios?id=${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Error al eliminar el usuario');
			fetchUsuarios();
		} catch (err: any) {
			setError(err.message);
		}
	};

	useEffect(() => {
		fetchUsuarios();
	}, []);

	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Gestión de Usuarios
				</h1>
				{error && <p className='text-red-500 mb-4'>{error}</p>}
				<form
					onSubmit={handleSubmit}
					className='mb-8 space-y-4'
				>
					<input
						type='email'
						placeholder='Correo electrónico'
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						className='border p-2 w-full'
					/>
					<input
						type='password'
						placeholder='Contraseña'
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						className='border p-2 w-full'
					/>
					<select
						value={form.rol}
						onChange={(e) => setForm({ ...form, rol: e.target.value })}
						className='border p-2 w-full'
					>
						<option value=''>Seleccionar rol</option>
						<option value='Admin'>Admin</option>
						<option value='Usuario'>Usuario</option>
					</select>
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
								Correo
							</th>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Rol
							</th>
							<th className='border border-gray-300 px-4 py-2 bg-gray-200'>
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{usuarios.map((usuario) => (
							<tr key={usuario.id}>
								<td className='border border-gray-300 px-4 py-2'>
									{usuario.email}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									{usuario.rol}
								</td>
								<td className='border border-gray-300 px-4 py-2'>
									<div className='flex space-x-2'>
										<button
											className='bg-yellow-500 text-white px-2 py-1'
											onClick={() => handleEdit(usuario)}
										>
											Editar
										</button>
										<button
											className='bg-red-500 text-white px-2 py-1'
											onClick={() => handleDelete(usuario.id)}
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
