'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Mail, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        const { error: resetError } = await resetPassword(email);

        if (resetError) {
            setError(resetError);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>.
                        Click the link in the email to reset your password.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-blue-800 mb-2">
                            <strong>Didn't receive the email?</strong>
                        </p>
                        <ul className="text-sm text-blue-700 ml-4 list-disc space-y-1">
                            <li>Check your spam folder</li>
                            <li>Make sure you entered the correct email</li>
                            <li>Wait a few minutes and try again</li>
                        </ul>
                    </div>
                    <Link
                        href="/auth/signin"
                        className="inline-block w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            MaiBeauti
                        </h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                    <p className="text-gray-600">No worries! We'll send you reset instructions.</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${error ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to Sign In */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
