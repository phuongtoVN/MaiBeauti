'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Trash2, Sparkles } from 'lucide-react';

interface Analysis {
    id: string;
    image_url: string;
    skin_score: number | null;
    concerns: string[] | null;
    created_at: string;
    acne_level: string | null;
    pores_level: string | null;
    wrinkles_level: string | null;
    dark_circles: string | null;
    skin_tone: string | null;
    facepp_response: any;
}

export default function AnalysisDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && params.id) {
            fetchAnalysis();
        }
    }, [user, params.id]);

    const fetchAnalysis = async () => {
        try {
            const { data, error } = await supabase
                .from('skin_analyses')
                .select('*')
                .eq('id', params.id)
                .eq('user_id', user?.id)
                .single();

            if (error) throw error;
            setAnalysis(data);
        } catch (error) {
            console.error('Error fetching analysis:', error);
            router.push('/dashboard/analyses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this analysis?')) return;

        try {
            const { error } = await supabase
                .from('skin_analyses')
                .delete()
                .eq('id', params.id);

            if (error) throw error;
            router.push('/dashboard/analyses');
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
                    <p className="text-gray-600">Loading analysis...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    const getLevelColor = (level: string | null) => {
        if (!level) return 'bg-gray-100 text-gray-700';
        const lowerLevel = level.toLowerCase();
        if (lowerLevel.includes('low') || lowerLevel.includes('good')) return 'bg-green-100 text-green-700';
        if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) return 'bg-yellow-100 text-yellow-700';
        if (lowerLevel.includes('high') || lowerLevel.includes('severe')) return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/analyses"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analysis Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(analysis.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="aspect-square bg-gray-100">
                        <img
                            src={analysis.image_url}
                            alt="Skin analysis"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                        <h2 className="text-lg font-semibold mb-2">Overall Skin Score</h2>
                        <div className="text-5xl font-bold mb-2">
                            {analysis.skin_score !== null ? `${analysis.skin_score}/100` : 'N/A'}
                        </div>
                        <p className="text-purple-100">
                            {analysis.skin_score && analysis.skin_score >= 80
                                ? 'Excellent skin health!'
                                : analysis.skin_score && analysis.skin_score >= 60
                                    ? 'Good skin health'
                                    : 'Room for improvement'}
                        </p>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
                        <div className="space-y-3">
                            {analysis.acne_level && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Acne Level</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(analysis.acne_level)}`}>
                                        {analysis.acne_level}
                                    </span>
                                </div>
                            )}
                            {analysis.pores_level && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Pores</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(analysis.pores_level)}`}>
                                        {analysis.pores_level}
                                    </span>
                                </div>
                            )}
                            {analysis.wrinkles_level && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Wrinkles</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(analysis.wrinkles_level)}`}>
                                        {analysis.wrinkles_level}
                                    </span>
                                </div>
                            )}
                            {analysis.dark_circles && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Dark Circles</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(analysis.dark_circles)}`}>
                                        {analysis.dark_circles}
                                    </span>
                                </div>
                            )}
                            {analysis.skin_tone && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Skin Tone</span>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                        {analysis.skin_tone}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Concerns */}
                    {analysis.concerns && analysis.concerns.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Concerns</h2>
                            <div className="flex flex-wrap gap-2">
                                {analysis.concerns.map((concern, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium"
                                    >
                                        {concern}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link
                            href="/analyze"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                        >
                            <Sparkles className="w-5 h-5" />
                            Get New Analysis
                        </Link>
                        <Link
                            href="/products"
                            className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-center"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
