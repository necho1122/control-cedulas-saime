'use client';

import Link from 'next/link';

export default function Administracion() {
	return (
		<div>
			<h1>Administración</h1>
			<p>
				Bienvenido al panel de administración. Selecciona una sección para
				gestionar la aplicación:
			</p>
			<ul>
				<li>
					<Link href='/administracion/documentos'>Gestión de Documentos</Link>
				</li>
				<li>
					<Link href='/administracion/usuarios'>Gestión de Usuarios</Link>
				</li>
				<li>
					<Link href='/administracion/configuracion'>Configuración</Link>
				</li>
			</ul>
		</div>
	);
}
