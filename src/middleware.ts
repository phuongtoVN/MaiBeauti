import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    req.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    res.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: any) {
                    req.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    res.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    const protectedPaths = ['/dashboard', '/profile'];
    const isProtectedPath = protectedPaths.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );

    // If accessing protected route without auth, redirect to signin
    if (isProtectedPath && !user) {
        const redirectUrl = new URL('/auth/signin', req.url);
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
