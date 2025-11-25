'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UseUserReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook to get current authenticated user
 * Simpler alternative to useAuth when you only need user data
 */
export function useUser(): UseUserReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get current user
        const getUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    setError(error.message);
                    setUser(null);
                } else {
                    setUser(user);
                    setError(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading, error };
}
