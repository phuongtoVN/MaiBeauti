'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Calendar, Settings, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, updateProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.user_metadata?.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        const updates: any = {};
        if (name !== user?.user_metadata?.name) {
            updates.name = name;
        }
        if (email !== user?.email) {
            updates.email = email;
        }

        if (Object.keys(updates).length === 0) {
            setIsEditing(false);
            setSaving(false);
            return;
        }

        const { error } = await updateProfile(updates);

        if (error) {
            setMessage({ type: 'error', text: error });
            setSaving(false);
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setSaving(false);
            setIsEditing(false);

            // If email was changed, show verification message
            if (updates.email) {
                setMessage({
                    type: 'success',
                    text: 'Profile updated! Please check your new email to verify the change.'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/signin');
        return null;
    }

    const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Unknown';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        </div>
                        <Link
                            href="/profile/settings"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {message.text}
                        </p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header with Avatar */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex items-end gap-6 -mt-16 mb-6">
                            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-400" />
                            </div>
                            <div className="flex-1 pt-16">
                                {!isEditing ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{name || 'No name set'}</h2>
                                            <p className="text-gray-600">{email}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                placeholder="Enter your email"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Changing your email will require verification
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setName(user.user_metadata?.name || '');
                                                    setEmail(user.email || '');
                                                }}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium text-gray-900">{email}</p>
                                    <p className="text-xs text-green-600 mt-1">✓ Verified</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="font-medium text-gray-900">{createdAt}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <Link
                        href="/dashboard/analyses"
                        className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                        <h3 className="font-semibold text-gray-900 mb-1">My Analyses</h3>
                        <p className="text-sm text-gray-600">View your skin analysis history</p>
                    </Link>

                    <Link
                        href="/dashboard/orders"
                        className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                        <h3 className="font-semibold text-gray-900 mb-1">Order History</h3>
                        <p className="text-sm text-gray-600">Track your orders and purchases</p>
                    </Link>

                    <Link
                        href="/profile/settings"
                        className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                        <h3 className="font-semibold text-gray-900 mb-1">Account Settings</h3>
                        <p className="text-sm text-gray-600">Manage your account preferences</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
