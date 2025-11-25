'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Package, Eye, Calendar, DollarSign } from 'lucide-react';

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address: any;
}

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'delivered') return 'bg-green-100 text-green-700';
        if (statusLower === 'shipped') return 'bg-blue-100 text-blue-700';
        if (statusLower === 'paid') return 'bg-purple-100 text-purple-700';
        if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-700';
        return 'bg-gray-100 text-gray-700';
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status.toLowerCase() === filterStatus);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
                    {['all', 'pending', 'paid', 'shipped', 'delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Package className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Order #{order.id.slice(0, 8).toUpperCase()}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{order.total_amount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/dashboard/orders/${order.id}`}
                                    className="flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {filterStatus === 'all'
                            ? 'Start shopping to see your orders here'
                            : 'Try selecting a different filter'}
                    </p>
                    {filterStatus === 'all' && (
                        <Link
                            href="/products"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                        >
                            Browse Products
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
