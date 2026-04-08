import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { toast } from 'sonner';

const FirebaseAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading orders...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Orders
          </h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{order.orderId || order.id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.customerPhone}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.totalAmount}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(order.id, e.target.value);
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-[#E8A0A8] ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#E8A0A8] font-medium">
                          {selectedOrder === order.id ? 'Hide Details ▲' : 'View Details ▼'}
                        </td>
                      </tr>
                      {selectedOrder === order.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                                <p className="text-sm text-gray-600">
                                  <strong>Name:</strong> {order.customerName}<br />
                                  <strong>Phone:</strong> {order.customerPhone}<br />
                                  <strong>Address:</strong> {order.deliveryAddress}<br />
                                  <strong>Payment:</strong> {order.paymentMethod}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {order.items && order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span>{item.productName} x {item.quantity}</span>
                                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="border-t pt-2">
                                <div className="flex justify-between font-bold">
                                  <span>Total Amount:</span>
                                  <span className="text-[#E8A0A8]">₹{order.totalAmount}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FirebaseAdminOrders;
