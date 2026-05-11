'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { status } = useSession();

	const callbackUrl = useMemo(() => {
		const raw = searchParams.get('callbackUrl') || '/';
		if (!raw.startsWith('/') || raw === '/login') {
			return '/';
		}
		return raw;
	}, [searchParams]);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (status === 'authenticated') {
			router.replace(callbackUrl);
			router.refresh();
		}
	}, [status, router, callbackUrl]);

	if (status === 'loading' || status === 'authenticated') {
		return (
			<div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
				<p className='text-sm text-gray-600'>Redirigiendo...</p>
			</div>
		);
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setIsLoading(true);

		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
			callbackUrl,
		});

		setIsLoading(false);

		if (!result || result.error) {
			setError('Credenciales inválidas. Verifica correo y contraseña.');
			return;
		}

		router.push(result.url || callbackUrl);
		router.refresh();
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
			<div className='w-full max-w-md rounded-xl bg-white shadow-lg p-6'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>
					Iniciar sesión
				</h1>
				<p className='text-sm text-gray-600 mb-6'>
					Accede con tu usuario del sistema para continuar.
				</p>

				{error && <p className='mb-4 text-sm text-red-600'>{error}</p>}

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
							required
						/>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60'
					>
						{isLoading ? 'Validando...' : 'Entrar'}
					</button>
				</form>
			</div>
		</div>
	);
}
