'use client';

import Link from 'next/link';

export default function Administracion() {
	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Panel de Administración
				</h1>
				<p className='text-gray-600 mb-8'>
					Bienvenido al panel de administración. Selecciona una sección para
					gestionar la aplicación:
				</p>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
					<Link href='/administracion/documentos'>
						<div className='bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 cursor-pointer'>
							<h2 className='text-xl font-semibold'>Gestión de Documentos</h2>
							<p className='mt-2 text-sm'>
								Administra los documentos registrados, cambia su estatus o
								elimínalos.
							</p>
						</div>
					</Link>
					<Link href='/administracion/usuarios'>
						<div className='bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 cursor-pointer'>
							<h2 className='text-xl font-semibold'>Gestión de Usuarios</h2>
							<p className='mt-2 text-sm'>
								Administra los usuarios del sistema y sus roles.
							</p>
						</div>
					</Link>
					<Link href='/administracion/configuracion'>
						<div className='bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 cursor-pointer'>
							<h2 className='text-xl font-semibold'>Configuración</h2>
							<p className='mt-2 text-sm'>
								Personaliza las configuraciones del sistema.
							</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
