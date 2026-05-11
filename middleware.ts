import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPrefixes = ['/registro', '/organizacion', '/administracion'];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isProtectedRoute =
		pathname === '/' ||
		protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	const token = await getToken({ req: request });

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
