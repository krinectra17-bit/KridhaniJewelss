import React from 'react';

const RecentOrdersTable = ({ orders }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-testid="recent-orders-table">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                No orders yet
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.orderId || order.id} className="hover:bg-gray-50" data-testid={`order-row-${order.orderId || order.id}`}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.orderId || order.id.substring(0, 8)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentOrdersTable;
