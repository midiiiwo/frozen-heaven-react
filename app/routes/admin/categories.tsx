import { useState, useMemo } from "react";
import type { Route } from "./+types/customers";
import { useGetCustomers } from "../../hooks/useCustomer";
import { useGetOrders } from "../../hooks/useOrders";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Customers - Admin - Frozen Haven" }];
}

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const { data: customers, isLoading: customersLoading } = useGetCustomers();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();

  const isLoading = customersLoading || ordersLoading;

  const customerStats = useMemo(() => {
    if (!orders || !customers) return [];

    return customers.map((customer) => {
      const customerOrders = orders.filter(
        (order) => order.customerEmail === customer.email
      );
      const completedOrders = customerOrders.filter(
        (order) => order.status === "completed"
      );

      const totalSpent = completedOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      const lastOrder =
        customerOrders.length > 0
          ? customerOrders.sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime()
            )[0].createdAt
          : null;

      return {
        ...customer,
        orders: customerOrders.length,
        totalSpent,
        lastOrder: lastOrder
          ? new Date(lastOrder).toLocaleDateString()
          : "Never",
        status: customerOrders.length > 0 ? "active" : "inactive",
      };
    });
  }, [customers, orders]);

  const filteredCustomers = customerStats.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: customerStats.length,
    active: customerStats.filter((c) => c.status === "active").length,
    inactive: customerStats.filter((c) => c.status === "inactive").length,
    revenue: customerStats.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  const customerOrderHistory = useMemo(() => {
    if (!selectedCustomer || !orders) return [];
    return orders.filter((order) => order.customerEmail === selectedCustomer);
  }, [selectedCustomer, orders]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600">
            Manage customer information and history
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Customers</span>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : stats.total}
          </h3>
          <p className="text-sm text-gray-500 mt-1">All customers</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Customers</span>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : stats.active}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Have placed orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Inactive</span>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : stats.inactive}
          </h3>
          <p className="text-sm text-gray-500 mt-1">No orders yet</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : `GHC ${stats.revenue.toLocaleString()}`}
          </h3>
          <p className="text-sm text-gray-500 mt-1">From all customers</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900 placeholder:text-gray-500"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading customers...</p>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Orders
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Total Spent
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Last Order
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1b4b27] text-white rounded-full flex items-center justify-center font-semibold">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-gray-900">
                          {customer.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                        {customer.orders}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#1b4b27]">
                        GHC {customer.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">
                        {customer.lastOrder}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          customer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedCustomer(customer.email)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Order History"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No customers found</p>
            </div>
          )}
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order History
                </h2>
                <p className="text-gray-600">{selectedCustomer}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {customerOrderHistory.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                No orders found for this customer
              </p>
            ) : (
              <div className="space-y-4">
                {customerOrderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900">
                          Order #{order.id?.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt!).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt!).toLocaleTimeString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${order.status === "processing" ? "bg-blue-100 text-blue-800" : ""}
                        ${order.status === "completed" ? "bg-green-100 text-green-800" : ""}
                        ${order.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                      `}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            GHC {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Total</span>
                        <span>GHC {order.total.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
