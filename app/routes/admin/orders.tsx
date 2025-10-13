import type { Route } from "./+types/orders";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Orders - Admin - Frozen Haven" }];
}

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    items: 3,
    total: 750,
    status: "pending",
    date: "2025-01-10",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    items: 5,
    total: 1200,
    status: "processing",
    date: "2025-01-10",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    items: 2,
    total: 400,
    status: "completed",
    date: "2025-01-09",
  },
  {
    id: "ORD-004",
    customer: "Sarah Williams",
    items: 4,
    total: 980,
    status: "pending",
    date: "2025-01-09",
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    items: 6,
    total: 1450,
    status: "shipped",
    date: "2025-01-08",
  },
];

export default function AdminOrders() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment</p>
      </div>

      {/* Order Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-900">23</h3>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-600">8</h3>
          <p className="text-sm text-gray-500 mt-1">Awaiting processing</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Processing</p>
          <h3 className="text-3xl font-bold text-blue-600">5</h3>
          <p className="text-sm text-gray-500 mt-1">Being prepared</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Completed</p>
          <h3 className="text-3xl font-bold text-green-600">10</h3>
          <p className="text-sm text-gray-500 mt-1">Successfully delivered</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4b27]">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <span className="font-mono font-semibold text-gray-900">
                      {order.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{order.customer}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">{order.items} items</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      GHC {order.total}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600 text-sm">{order.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-[#1b4b27] hover:underline font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
