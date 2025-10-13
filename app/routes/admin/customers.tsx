import type { Route } from "./+types/customers";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Customers - Admin - Frozen Haven" }];
}

const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+233 123 456 789",
    orders: 12,
    totalSpent: 4500,
    joinDate: "2024-06-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+233 987 654 321",
    orders: 8,
    totalSpent: 3200,
    joinDate: "2024-07-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+233 555 123 456",
    orders: 15,
    totalSpent: 5800,
    joinDate: "2024-05-10",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+233 444 789 012",
    orders: 6,
    totalSpent: 2400,
    joinDate: "2024-08-05",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    phone: "+233 333 456 789",
    orders: 10,
    totalSpent: 4100,
    joinDate: "2024-06-28",
  },
];

export default function AdminCustomers() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">
          Manage customer information and relationships
        </p>
      </div>

      {/* Customer Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total Customers</p>
          <h3 className="text-3xl font-bold text-gray-900">342</h3>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Active Customers</p>
          <h3 className="text-3xl font-bold text-gray-900">289</h3>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">New Customers</p>
          <h3 className="text-3xl font-bold text-gray-900">45</h3>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Avg. Order Value</p>
          <h3 className="text-3xl font-bold text-gray-900">GHC 435</h3>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            />
            <button className="px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium">
              + Add Customer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Orders
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Total Spent
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Join Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1b4b27] rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900 font-medium">
                      {customer.orders}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      GHC {customer.totalSpent.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600 text-sm">
                      {customer.joinDate}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-[#1b4b27] hover:underline font-medium text-sm">
                        View
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-blue-600 hover:underline font-medium text-sm">
                        Edit
                      </button>
                    </div>
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
