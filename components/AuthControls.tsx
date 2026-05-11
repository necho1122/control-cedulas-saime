'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function AuthControls() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <p className='text-sm text-gray-300'>Cargando sesión...</p>;
	}

	if (!session?.user) {
		return (
			<Link
				href='/login'
				className='inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700'
			>
				Iniciar sesión
			</Link>
		);
	}

	return (
		<div className='space-y-2'>
			<p className='text-xs text-gray-300'>
				{session.user.email} ({session.user.role})
			</p>
			<button
				onClick={() => signOut({ callbackUrl: '/login' })}
				className='inline-flex items-center rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600'
			>
				Cerrar sesión
			</button>
		</div>
	);
}
