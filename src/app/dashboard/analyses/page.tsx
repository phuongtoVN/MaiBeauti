'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';

interface Analysis {
    id: string;
    image_url: string;
    skin_score: number | null;
    concerns: string[] | null;
    created_at: string;
    acne_level: string | null;
    dark_circles: string | null;
}

export default function AnalysesPage() {
    const { user } = useAuth();
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('newest');

    useEffect(() => {
        if (user) {
            fetchAnalyses();
        }
    }, [user]);

    useEffect(() => {
        filterAndSortAnalyses();
    }, [analyses, searchTerm, sortBy]);

    const fetchAnalyses = async () => {
        try {
            const { data, error } = await supabase
                .from('skin_analyses')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAnalyses(data || []);
        } catch (error) {
            console.error('Error fetching analyses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortAnalyses = () => {
        let filtered = [...analyses];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((analysis) =>
                analysis.concerns?.some((concern) =>
                    concern.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortBy === 'score') {
                return (b.skin_score || 0) - (a.skin_score || 0);
            }
            return 0;
        });

        setFilteredAnalyses(filtered);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this analysis?')) return;

        try {
            const { error } = await supabase
                .from('skin_analyses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setAnalyses(analyses.filter((a) => a.id !== id));
        } catch (error) {
            console.error('Error deleting analysis:', error);
            alert('Failed to delete analysis');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analyses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Analyses</h1>
                <p className="text-gray-600">View and manage your skin analysis history</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by concern..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="score">Highest Score</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredAnalyses.length} of {analyses.length} analyses
            </div>

            {/* Analyses Grid */}
            {filteredAnalyses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnalyses.map((analysis) => (
                        <div
                            key={analysis.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Image */}
                            {analysis.image_url && (
                                <div className="aspect-square bg-gray-100 relative">
                                    <img
                                        src={analysis.image_url}
                                        alt="Skin analysis"
                                        className="w-full h-full object-cover"
                                    />
                                    {analysis.skin_score !== null && (
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-lg font-bold text-purple-600">
                                                {analysis.skin_score}/100
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-4">
                                {/* Date */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                {/* Concerns */}
                                {analysis.concerns && analysis.concerns.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {analysis.concerns.slice(0, 3).map((concern, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                                            >
                                                {concern}
                                            </span>
                                        ))}
                                        {analysis.concerns.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                +{analysis.concerns.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/analyses/${analysis.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(analysis.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete analysis"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'No matching analyses' : 'No analyses yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Get started by uploading a photo for your first skin analysis'}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/analyze"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                        >
                            Get Your First Analysis
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
