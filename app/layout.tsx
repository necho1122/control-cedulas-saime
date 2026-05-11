import './globals.css';
import Link from 'next/link';
import Image from 'next/image'; // Importar el componente Image
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import Providers from './providers';
import AuthControls from '../components/AuthControls';

export const metadata = {
	title: 'Sistema de Gestión de Cédulas',
	description: 'Aplicación interna para el SAIME de Venezuela',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	const isAuthenticated = Boolean(session?.user);

	return (
		<html lang='es'>
			<body>
				<Providers>
					<LayoutContent isAuthenticated={isAuthenticated}>
						{children}
					</LayoutContent>
				</Providers>
			</body>
		</html>
	);
}

function LayoutContent({
	children,
	isAuthenticated,
}: {
	children: React.ReactNode;
	isAuthenticated: boolean;
}) {
	return (
		<div className='min-h-screen bg-gray-100 md:flex'>
			<aside className='w-full md:w-64 bg-gray-800 text-white p-4 md:min-h-screen'>
				<div className='flex items-center justify-between md:block'>
					<Image
						src='https://i.imgur.com/eFdWg1H_d.webp?maxwidth=760&fidelity=grand'
						alt='Logo del proyecto'
						width={120}
						height={120}
						className='mb-3'
					/>
					<AuthControls />
				</div>

				{isAuthenticated ? (
					<nav className='mt-4'>
						<ul className='space-y-4 text-sm md:text-base'>
							<li>
								<Link
									href='/'
									className='hover:underline font-medium'
								>
									Inicio
								</Link>
							</li>
							<li>
								<Link
									href='/registro'
									className='hover:underline font-medium'
								>
									Registro de Documentos
								</Link>
							</li>
							<li>
								<Link
									href='/organizacion'
									className='hover:underline font-medium'
								>
									Organización
								</Link>
							</li>
							<li className='pt-2 border-t border-gray-700'>
								<Link
									href='/administracion'
									className='hover:underline font-medium'
								>
									Administración
								</Link>
								<ul className='mt-2 ml-3 space-y-2 text-sm text-gray-300'>
									<li>
										<Link
											href='/administracion/documentos'
											className='hover:text-white'
										>
											Documentos
										</Link>
									</li>
									<li>
										<Link
											href='/administracion/usuarios'
											className='hover:text-white'
										>
											Usuarios
										</Link>
									</li>
									<li>
										<Link
											href='/administracion/configuracion'
											className='hover:text-white'
										>
											Configuración
										</Link>
									</li>
								</ul>
							</li>
						</ul>
					</nav>
				) : (
					<p className='mt-4 text-sm text-gray-300'>
						Inicia sesión para ver las opciones del sistema.
					</p>
				)}
			</aside>
			<main className='flex-1 p-4 md:p-6 overflow-x-auto'>{children}</main>
		</div>
	);
}
