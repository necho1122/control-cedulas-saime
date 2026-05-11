import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface User {
		role: 'Admin' | 'Usuario';
		firebaseIdToken?: string;
	}

	interface Session {
		user: DefaultSession['user'] & {
			id: string;
			role: 'Admin' | 'Usuario';
		};
		firebaseIdToken?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		role?: 'Admin' | 'Usuario';
		firebaseIdToken?: string;
	}
}
