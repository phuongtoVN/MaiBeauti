'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    updatePassword: (password: string) => Promise<{ error: string | null }>;
    updateProfile: (data: { name?: string; email?: string }) => Promise<{ error: string | null }>;
}

/**
 * Custom hook for authentication
 * Provides auth state and actions for signup, signin, signout, etc.
 */
export function useAuth(): AuthState & AuthActions {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, name: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setError(error.message);
                return { error: error.message };
            }

            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred during signup';
            setError(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Provide user-friendly error messages
                let friendlyMessage = error.message;
                if (error.message.includes('Invalid login credentials')) {
                    friendlyMessage = 'Invalid email or password. Please try again.';
                } else if (error.message.includes('Email not confirmed')) {
                    friendlyMessage = 'Please verify your email address before signing in.';
                }
                setError(friendlyMessage);
                return { error: friendlyMessage };
            }

            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred during signin';
            setError(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            router.push('/');
        } catch (err) {
            console.error('Error signing out:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                setError(error.message);
                return { error: error.message };
            }

            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (password: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                setError(error.message);
                return { error: error.message };
            }

            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: { name?: string; email?: string }) => {
        try {
            setLoading(true);
            setError(null);

            const updateData: any = {};
            if (data.email) updateData.email = data.email;
            if (data.name) updateData.data = { name: data.name };

            const { error } = await supabase.auth.updateUser(updateData);

            if (error) {
                setError(error.message);
                return { error: error.message };
            }

            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        session,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
    };
}
