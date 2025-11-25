'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Package, MapPin, CreditCard, RefreshCw } from 'lucide-react';

interface Order {
    id: string;
    total_amount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    status: string;
    created_at: string;
    shipping_address: any;
    email: string;
}

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products: {
        name: string;
        image_url: string | null;
    };
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && params.id) {
            fetchOrderDetails();
        }
    }, [user, params.id]);

    const fetchOrderDetails = async () => {
        try {
            // Fetch order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', params.id)
                .eq('user_id', user?.id)
                .single();

            if (orderError) throw orderError;
            setOrder(orderData);

            // Fetch order items with product details
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select(`
          *,
          products (
            name,
            image_url
          )
        `)
                .eq('order_id', params.id);

            if (itemsError) throw itemsError;
            setOrderItems(itemsData || []);
        } catch (error) {
            console.error('Error fetching order details:', error);
            router.push('/dashboard/orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'delivered') return 'bg-green-100 text-green-700 border-green-200';
        if (statusLower === 'shipped') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (statusLower === 'paid' || statusLower === 'processing') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        if (statusLower === 'pending') return 'bg-gray-100 text-gray-700 border-gray-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/orders"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(order.created_at).toLocaleDateString('en-US', {
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
                <span className={`px-4 py-2 rounded-full font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.products.image_url ? (
                                            <img
                                                src={item.products.image_url}
                                                alt={item.products.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.products.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            ${(item.price * item.quantity).toFixed(2)} total
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <MapPin className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                            </div>
                            <div className="text-gray-700 space-y-1">
                                <p>{order.shipping_address.name}</p>
                                <p>{order.shipping_address.street}</p>
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                                </p>
                                <p>{order.shipping_address.country}</p>
                                {order.shipping_address.phone && <p className="mt-2">Phone: {order.shipping_address.phone}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span>${order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                        </div>
                        <p className="text-gray-700">
                            {order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                                ? 'Payment completed'
                                : 'Payment pending'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{order.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                // Reorder functionality - would add items to cart
                                alert('Reorder functionality coming soon!');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Reorder
                        </button>
                        <Link
                            href="/products"
                            className="block w-full text-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
