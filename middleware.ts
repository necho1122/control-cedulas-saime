import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPrefixes = ['/registro', '/organizacion', '/administracion'];
const AUTH_SECRET = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const token = await getToken({ req: request, secret: AUTH_SECRET });

	if (pathname === '/login' && token) {
		const callbackParam = searchParams.get('callbackUrl');
		const targetPath =
			callbackParam &&
			callbackParam.startsWith('/') &&
			callbackParam !== '/login'
				? callbackParam
				: '/';

		return NextResponse.redirect(new URL(targetPath, request.url));
	}

	const isProtectedRoute =
		pathname === '/' ||
		protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	if (isProtectedRoute) {
		if (!token) {
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('callbackUrl', pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
