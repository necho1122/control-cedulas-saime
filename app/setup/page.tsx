'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setSuccess('');

		try {
			setIsSubmitting(true);
			const res = await fetch('/api/usuarios', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, rol: 'Admin' }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || 'No se pudo crear el usuario inicial');
			}

			setSuccess('Usuario administrador creado. Ahora inicia sesión.');
			setTimeout(() => router.push('/login'), 800);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
			<div className='w-full max-w-md rounded-xl bg-white shadow-lg p-6'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>
					Configuración inicial
				</h1>
				<p className='text-sm text-gray-600 mb-6'>
					Crea el primer usuario administrador del sistema.
				</p>

				{error && <p className='mb-4 text-sm text-red-600'>{error}</p>}
				{success && <p className='mb-4 text-sm text-green-600'>{success}</p>}

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Correo
						</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Contraseña
						</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
							minLength={8}
							required
						/>
					</div>

					<button
						type='submit'
						disabled={isSubmitting}
						className='w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60'
					>
						{isSubmitting ? 'Creando...' : 'Crear Administrador'}
					</button>
				</form>
			</div>
		</div>
	);
}
