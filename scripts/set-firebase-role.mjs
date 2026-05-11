import fs from 'fs';
import path from 'path';
import process from 'process';
import {
	getApps,
	initializeApp,
	cert,
	applicationDefault,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function loadEnvFile() {
	const envPath = path.resolve(process.cwd(), '.env.local');
	if (!fs.existsSync(envPath)) {
		return;
	}

	const content = fs.readFileSync(envPath, 'utf8');
	const lines = content.split(/\r?\n/);

	for (const line of lines) {
		if (!line || line.trim().startsWith('#') || !line.includes('=')) {
			continue;
		}

		const idx = line.indexOf('=');
		const key = line.slice(0, idx).trim();
		const rawValue = line.slice(idx + 1).trim();

		if (!key || process.env[key] !== undefined) {
			continue;
		}

		let value = rawValue;
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		process.env[key] = value;
	}
}

function parseArgs() {
	const args = process.argv.slice(2);
	const result = { email: '', role: 'Admin' };

	for (let i = 0; i < args.length; i += 1) {
		const current = args[i];
		if (current === '--email') {
			result.email = (args[i + 1] || '').trim().toLowerCase();
			i += 1;
		} else if (current === '--role') {
			result.role = (args[i + 1] || '').trim();
			i += 1;
		}
	}

	return result;
}

function initAdminApp() {
	if (getApps().length > 0) {
		return getApps()[0];
	}

	const projectId =
		process.env.FIREBASE_PROJECT_ID ||
		process.env.GOOGLE_CLOUD_PROJECT ||
		process.env.GCLOUD_PROJECT ||
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

	if (!projectId) {
		throw new Error(
			'Falta FIREBASE_PROJECT_ID o GOOGLE_CLOUD_PROJECT en entorno.',
		);
	}

	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

	if (clientEmail && privateKey) {
		return initializeApp({
			credential: cert({ projectId, clientEmail, privateKey }),
			projectId,
		});
	}

	if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
		return initializeApp({
			credential: applicationDefault(),
			projectId,
		});
	}

	throw new Error(
		'No hay credenciales Admin. Define FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY o GOOGLE_APPLICATION_CREDENTIALS.',
	);
}

async function main() {
	loadEnvFile();

	const { email, role } = parseArgs();
	if (!email) {
		throw new Error('Debes indicar --email (ej: --email ruth@saime.com).');
	}

	const allowedRoles = new Set(['Admin', 'Usuario']);
	if (!allowedRoles.has(role)) {
		throw new Error('Rol inválido. Usa --role Admin o --role Usuario.');
	}

	initAdminApp();

	const auth = getAuth();
	const user = await auth.getUserByEmail(email);

	await auth.setCustomUserClaims(user.uid, {
		role,
		admin: role === 'Admin',
	});

	console.log(`Claims actualizados para ${email}`);
	console.log(`uid: ${user.uid}`);
	console.log(`role: ${role}`);
	console.log(
		'Importante: cierra sesión y vuelve a iniciar sesión para refrescar el token.',
	);
}

main().catch((error) => {
	console.error('Error al asignar claims:', error.message || error);
	process.exit(1);
});
