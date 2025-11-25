import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Auth Callback Route
 * Handles email verification and password reset callbacks from Supabase
 */
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');

    // Handle errors from Supabase
    if (error) {
        console.error('Auth callback error:', error, errorDescription);
        return NextResponse.redirect(
            new URL(`/auth/signin?error=${encodeURIComponent(errorDescription || error)}`, request.url)
        );
    }

    // Exchange code for session
    if (code) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        try {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
                console.error('Error exchanging code for session:', exchangeError);
                return NextResponse.redirect(
                    new URL(`/auth/signin?error=${encodeURIComponent(exchangeError.message)}`, request.url)
                );
            }

            // Successfully authenticated, redirect to next page
            return NextResponse.redirect(new URL(next, request.url));
        } catch (err) {
            console.error('Unexpected error in auth callback:', err);
            return NextResponse.redirect(
                new URL('/auth/signin?error=An unexpected error occurred', request.url)
            );
        }
    }

    // No code provided, redirect to signin
    return NextResponse.redirect(new URL('/auth/signin', request.url));
}
