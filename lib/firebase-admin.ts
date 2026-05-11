import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getPrivateKey() {
	const raw = process.env.FIREBASE_PRIVATE_KEY;
	if (!raw) {
		return undefined;
	}

	// Vercel and dotenv often store newlines escaped.
	return raw.replace(/\\n/g, '\n');
}

function getProjectId() {
	return (
		process.env.FIREBASE_PROJECT_ID ||
		process.env.GOOGLE_CLOUD_PROJECT ||
		process.env.GCLOUD_PROJECT ||
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
	);
}

function initFirebaseAdmin() {
	if (getApps().length > 0) {
		return getApps()[0];
	}

	const projectId = getProjectId();
	if (!projectId) {
		throw new Error(
			'Firebase Admin no tiene projectId. Define FIREBASE_PROJECT_ID o GOOGLE_CLOUD_PROJECT.',
		);
	}

	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = getPrivateKey();

	if (clientEmail && privateKey) {
		return initializeApp({
			credential: cert({
				projectId,
				clientEmail,
				privateKey,
			}),
			projectId,
		});
	}

	// Fallback for environments with Application Default Credentials configured.
	return initializeApp({ projectId });
}

export function getAdminDb() {
	const adminApp = initFirebaseAdmin();
	return getFirestore(adminApp);
}
