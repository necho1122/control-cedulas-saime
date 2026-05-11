import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

const ALLOWED_ROLES = new Set(['Admin', 'Usuario']);
const AUTH_SECRET = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

type FirebaseAuthSignInResponse = {
	localId: string;
	email: string;
	idToken: string;
};

type FirebaseIdTokenPayload = {
	admin?: boolean;
	role?: string;
};

function getRoleFromIdToken(idToken: string): 'Admin' | 'Usuario' {
	try {
		const parts = idToken.split('.');
		if (parts.length !== 3) {
			return 'Usuario';
		}

		const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = Buffer.from(payloadBase64, 'base64').toString('utf8');
		const payload = JSON.parse(jsonPayload) as FirebaseIdTokenPayload;

		if (payload.admin === true) {
			return 'Admin';
		}

		if (payload.role && ALLOWED_ROLES.has(payload.role)) {
			return payload.role as 'Admin' | 'Usuario';
		}

		return 'Usuario';
	} catch {
		return 'Usuario';
	}
}

async function signInWithFirebaseAuth(
	email: string,
	password: string,
): Promise<FirebaseAuthSignInResponse | null> {
	const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
	if (!apiKey) {
		console.error('NEXT_PUBLIC_FIREBASE_API_KEY no está configurada.');
		return null;
	}

	const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email,
			password,
			returnSecureToken: true,
		}),
	});

	if (!response.ok) {
		try {
			const errorPayload = await response.json();
			console.error('Firebase Auth signInWithPassword error:', errorPayload);
		} catch {
			console.error('Firebase Auth signInWithPassword error sin payload JSON');
		}
		return null;
	}

	return (await response.json()) as FirebaseAuthSignInResponse;
}

export const authOptions: NextAuthOptions = {
	secret: AUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
	providers: [
		CredentialsProvider({
			name: 'Credenciales',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const email = credentials?.email?.trim().toLowerCase();
				const password = credentials?.password ?? '';

				if (!email || !password) {
					throw new Error('Credenciales inválidas.');
				}

				const firebaseUser = await signInWithFirebaseAuth(email, password);
				if (!firebaseUser) {
					throw new Error('Credenciales inválidas.');
				}

				const role = getRoleFromIdToken(firebaseUser.idToken);

				return {
					id: firebaseUser.localId,
					email: firebaseUser.email,
					role,
					firebaseIdToken: firebaseUser.idToken,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.firebaseIdToken = user.firebaseIdToken;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? '';
				session.user.role =
					typeof token.role === 'string' ? token.role : 'Usuario';
			}
			session.firebaseIdToken =
				typeof token.firebaseIdToken === 'string'
					? token.firebaseIdToken
					: undefined;
			return session;
		},
	},
};
