import './globals.css';
import Link from 'next/link';
import Image from 'next/image'; // Importar el componente Image

export const metadata = {
	title: 'Sistema de Gestión de Cédulas',
	description: 'Aplicación interna para el SAIME de Venezuela',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='es'>
			<body>
				<div className='flex h-screen'>
					<aside className='w-64 bg-gray-800 text-white p-4'>
						<Image
							src='/saime-seeklogo.png' // Ruta relativa desde la carpeta public
							alt='Logo del proyecto'
							width={150} // Especificar ancho
							height={150} // Especificar alto
							style={{ marginBottom: '20px' }} // Estilo adicional
						/>
						<nav>
							<ul className='space-y-4'>
								<li>
									<Link
										href='/'
										className='hover:underline'
									>
										Inicio
									</Link>
								</li>
								<li>
									<Link
										href='/registro'
										className='hover:underline'
									>
										Registro de Documentos
									</Link>
								</li>
								<li>
									<Link
										href='/organizacion'
										className='hover:underline'
									>
										Organización
									</Link>
								</li>
								<li>
									<Link
										href='/administracion'
										className='hover:underline'
									>
										Administración
									</Link>
								</li>
							</ul>
						</nav>
					</aside>
					<main className='flex-1 p-4'>{children}</main>
				</div>
			</body>
		</html>
	);
}
