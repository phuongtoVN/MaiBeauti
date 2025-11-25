'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { ScanFace, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';

interface DashboardStats {
    totalAnalyses: number;
    latestAnalysis: any;
    recentOrders: any[];
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalAnalyses: 0,
        latestAnalysis: null,
        recentOrders: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch total analyses count
            const { count: analysesCount } = await supabase
                .from('skin_analyses')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user?.id);

            // Fetch latest analysis
            const { data: latestAnalysis } = await supabase
                .from('skin_analyses')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // Fetch recent orders
            const { data: recentOrders } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(3);

            setStats({
                totalAnalyses: analysesCount || 0,
                latestAnalysis: latestAnalysis || null,
                recentOrders: recentOrders || [],
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.user_metadata?.name || 'there'}! 👋
                </h1>
                <p className="text-gray-600">Here's what's happening with your skincare journey</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Total Analyses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <ScanFace className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-500">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalAnalyses}</h3>
                    <p className="text-sm text-gray-600">Skin Analyses</p>
                    <Link
                        href="/dashboard/analyses"
                        className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium inline-block"
                    >
                        View all →
                    </Link>
                </div>

                {/* Latest Score */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-500">Latest</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.latestAnalysis?.skin_score ? `${stats.latestAnalysis.skin_score}/100` : 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">Skin Score</p>
                    {stats.latestAnalysis && (
                        <p className="mt-2 text-xs text-gray-500">
                            {new Date(stats.latestAnalysis.created_at).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-pink-100 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-pink-600" />
                        </div>
                        <span className="text-sm text-gray-500">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.recentOrders.length}</h3>
                    <p className="text-sm text-gray-600">Recent Orders</p>
                    <Link
                        href="/dashboard/orders"
                        className="mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium inline-block"
                    >
                        View all →
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Get New Analysis */}
                <Link
                    href="/analyze"
                    className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-white hover:shadow-lg transition-shadow group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">Get New Analysis</h3>
                            <p className="text-purple-100">Upload a photo to analyze your skin</p>
                        </div>
                    </div>
                    <div className="text-sm text-purple-100">
                        Our AI will analyze your skin and provide personalized recommendations
                    </div>
                </Link>

                {/* Browse Products */}
                <Link
                    href="/products"
                    className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <ShoppingBag className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Browse Products</h3>
                            <p className="text-gray-600">Find products perfect for your skin</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        Discover curated skincare products tailored to your needs
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            {stats.latestAnalysis && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Analysis</h2>
                    <div className="flex items-start gap-4">
                        {stats.latestAnalysis.image_url && (
                            <img
                                src={stats.latestAnalysis.image_url}
                                alt="Latest analysis"
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl font-bold text-purple-600">
                                    {stats.latestAnalysis.skin_score}/100
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(stats.latestAnalysis.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            {stats.latestAnalysis.concerns && stats.latestAnalysis.concerns.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {stats.latestAnalysis.concerns.slice(0, 3).map((concern: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                                        >
                                            {concern}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <Link
                                href={`/dashboard/analyses/${stats.latestAnalysis.id}`}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                View full analysis →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {stats.totalAnalyses === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ScanFace className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses yet</h3>
                    <p className="text-gray-600 mb-6">
                        Get started by uploading a photo for your first skin analysis
                    </p>
                    <Link
                        href="/analyze"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                    >
                        Get Your First Analysis
                    </Link>
                </div>
            )}
        </div>
    );
}
