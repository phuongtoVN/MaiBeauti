'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Lock, Trash2, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const { user, updatePassword, signOut } = useAuth();

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setPasswordLoading(true);
        const { error } = await updatePassword(passwordData.newPassword);

        if (error) {
            setPasswordMessage({ type: 'error', text: error });
            setPasswordLoading(false);
        } else {
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordLoading(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            return;
        }

        // In a real app, you'd call an API to soft-delete the account
        // For now, we'll just sign out
        await signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/profile"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Lock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                        </div>
                    </div>

                    {passwordMessage && (
                        <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${passwordMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                            }`}>
                            {passwordMessage.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            )}
                            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {passwordMessage.text}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {passwordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Delete Account */}
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Delete Account</h2>
                            <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                        </div>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete My Account
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800 mb-2">
                                    <strong>Warning:</strong> This action cannot be undone. All your data including:
                                </p>
                                <ul className="text-sm text-red-700 ml-4 list-disc space-y-1">
                                    <li>Skin analyses</li>
                                    <li>Order history</li>
                                    <li>Profile information</li>
                                </ul>
                                <p className="text-sm text-red-800 mt-2">will be permanently deleted.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <strong>DELETE</strong> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Type DELETE"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE'}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Deletion
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
