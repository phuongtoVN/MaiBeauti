'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    LayoutDashboard,
    ScanFace,
    ShoppingBag,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Analyses', href: '/dashboard/analyses', icon: ScanFace },
        { name: 'Order History', href: '/dashboard/orders', icon: ShoppingBag },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-4">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        MaiBeauti
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-200 py-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive(item.href)
                                            ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={() => {
                                signOut();
                                setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="lg:flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
                    <div className="p-6">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            MaiBeauti
                        </Link>
                    </div>

                    {/* User Info */}
                    <div className="px-6 py-4 border-y border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                    {user?.user_metadata?.name || 'User'}
                                </p>
                                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.href)
                                            ? 'bg-purple-50 text-purple-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sign Out */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                        <button
                            onClick={signOut}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
