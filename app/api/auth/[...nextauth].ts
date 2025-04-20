import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const user = await prisma.usuario.findUnique({
					where: { email: credentials?.email },
				});

				if (!user) {
					throw new Error('No se encontró un usuario con ese correo.');
				}

				const isValidPassword = await bcrypt.compare(
					credentials?.password || '',
					user.password
				);

				if (!isValidPassword) {
					throw new Error('Contraseña incorrecta.');
				}

				return { id: user.id.toString(), email: user.email, rol: user.rol };
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			session.user = token.user;
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.user = user;
			}
			return token;
		},
	},
});
