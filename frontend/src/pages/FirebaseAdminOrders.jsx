import React, { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { toast } from 'sonner';

const ORDER_STATUSES = [
  'Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
];

const statusColors = {
  'Order Placed': 'bg-blue-100 text-blue-800',
  'Confirmed': 'bg-indigo-100 text-indigo-800',
  'Processing': 'bg-purple-100 text-purple-800',
  'Packed': 'bg-yellow-100 text-yellow-800',
  'Shipped': 'bg-cyan-100 text-cyan-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const FirebaseAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      loadOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading orders...</div></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-orders">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Orders</h1>
          <p className="text-gray-600 mt-1">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.orderId;
              const statusClass = statusColors[order.status] || 'bg-gray-100 text-gray-800';
              return (
                <div key={order.orderId || order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`order-card-${order.orderId}`}>
                  {/* Order header */}
                  <div className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div>
                        <p className="text-sm font-bold text-gray-900" data-testid={`order-id-${order.orderId}`}>#{order.orderId}</p>
                        <p className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-700">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">₹{order.totalAmount}</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}>{order.status || 'Order Placed'}</span>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50/50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Customer</p>
                          <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-xs text-gray-600">{order.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                          <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Payment</p>
                          <p className="text-sm text-gray-700">{order.paymentMethod || 'Razorpay'}</p>
                          {order.razorpayPaymentId && <p className="text-xs text-gray-500 mt-0.5">ID: {order.razorpayPaymentId}</p>}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Items</p>
                        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-4 py-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-900">{item.productName}</span>
                                {item.size && <span className="ml-2 px-2 py-0.5 bg-[#FFF9FA] text-[#E8A0A8] text-xs font-semibold rounded">Size {item.size}</span>}
                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                              </div>
                              <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status update */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {ORDER_STATUSES.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(order.orderId, status)}
                              disabled={order.status === status}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                                order.status === status
                                  ? 'bg-[#E8A0A8] text-white border-[#E8A0A8]'
                                  : 'border-gray-200 text-gray-600 hover:border-[#E8A0A8] hover:text-[#E8A0A8]'
                              }`}
                              data-testid={`status-btn-${order.orderId}-${status.replace(/\s/g, '-').toLowerCase()}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FirebaseAdminOrders;
