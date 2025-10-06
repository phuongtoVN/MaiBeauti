'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, MessageCircle, ShoppingBag } from 'lucide-react';

interface AnalysisData {
    skinQualityScore: number | null;
    acneLevel: string;
    darkCircles: string;
    poresLevel: string;
    wrinkleLevel: string;
    skinTone: string;
    concerns: string[];
    recommendations: string[];
    imageUrl: string;
}

export default function ResultsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const analysisId = searchParams.get('id');
  
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        // Fetch analysis data from API
        const fetchAnalysis = async () => {
        if (!analysisId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/get-analysis?id=${analysisId}`);
            const data = await response.json();
            
            if (data.success) {
            setAnalysis(data.analysis);
            }
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchAnalysis();
    }, [analysisId]);

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your results...</p>
            </div>
        </div>
        );
    }

    if (!analysis) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">Analysis not found</p>
            <button
                onClick={() => router.push('/analyze')}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold"
            >
                Start New Analysis
            </button>
            </div>
        </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Attention';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <button
                onClick={() => router.push('/analyze')}
                className="flex items-center space-x-2 text-gray-700 hover:text-rose-500 transition"
                >
                <ArrowLeft className="w-5 h-5" />
                <span>New Analysis</span>
                </button>
                <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-rose-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                    MaiBeauti
                </span>
                </div>
                <div className="w-24" />
            </div>
            </div>
        </nav>

        {/* Results Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Skin Analysis Results
            </h1>
            <p className="text-lg text-gray-600">
                {"Here's what we discovered about your skin"}
            </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <img 
                    src={analysis.imageUrl}
                    alt="Your photo"
                    className="w-full rounded-xl mb-4"
                />
                {analysis.skinQualityScore !== null && (
                    <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Overall Skin Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(analysis.skinQualityScore)}`}>
                        {Math.round(analysis.skinQualityScore)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        {getScoreLabel(analysis.skinQualityScore)}
                    </p>
                    </div>
                )}
                </div>
            </div>

            {/* Right Column - Analysis Details */}
            <div className="lg:col-span-2 space-y-6">
                {/* Skin Metrics */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skin Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="Acne Level" value={analysis.acneLevel} />
                    <MetricCard label="Dark Circles" value={analysis.darkCircles} />
                    <MetricCard label="Pores" value={analysis.poresLevel} />
                    <MetricCard label="Wrinkles" value={analysis.wrinkleLevel} />
                </div>
                </div>

                {/* Concerns */}
                {analysis.concerns.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Primary Concerns</h2>
                    <div className="flex flex-wrap gap-3">
                    {analysis.concerns.map((concern, index) => (
                        <span
                        key={index}
                        className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full font-medium capitalize"
                        >
                        {concern}
                        </span>
                    ))}
                    </div>
                </div>
                )}

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-8 border border-rose-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Recommendations</h2>
                <ul className="space-y-4">
                    {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <Sparkles className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                    </li>
                    ))}
                </ul>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => router.push('/chat')}
                    className="px-6 py-4 bg-white border-2 border-rose-500 text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition flex items-center justify-center space-x-2"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat with Mai</span>
                </button>
                <button
                    onClick={() => router.push('/products')}
                    className="px-6 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center space-x-2"
                >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Shop Recommended Products</span>
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    const numValue = parseFloat(value);
    const getColor = () => {
        if (isNaN(numValue)) return 'bg-gray-100 text-gray-700';
        if (numValue < 30) return 'bg-green-100 text-green-700';
        if (numValue < 60) return 'bg-yellow-100 text-yellow-700';
        return 'bg-orange-100 text-orange-700';
    };

    const getLabel = () => {
        if (isNaN(numValue)) return value;
        if (numValue < 30) return 'Low';
        if (numValue < 60) return 'Moderate';
        return 'High';
    };

    return (
        <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getColor()}`}>
            {getLabel()}
        </span>
        </div>
    );
}