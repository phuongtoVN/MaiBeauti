/**
 * Supabase Authentication Helper Functions
 * Centralized auth logic for signup, signin, password reset, etc.
 */

import { createClient } from '@supabase/supabase-js';

// Client-side auth client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
  redirectUrl: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

/**
 * Get current user session
 */
export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    return { session: null, error };
  }
}

/**
 * Get current user
 */
export async function getUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(updates: {
  email?: string;
  password?: string;
  data?: Record<string, unknown>;
}) {
  try {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Send password reset email
 */
export async function resetPasswordForEmail(
  email: string,
  redirectUrl: string
) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

/**
 * Update password using access token
 */
export async function updatePassword(password: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Verify email with OTP
 */
export async function verifyOtp(email: string, token: string, type: 'email' | 'sms' = 'email') {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as any,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Get Supabase client for direct operations
 */
export function getSupabaseClient() {
  return supabase;
}
