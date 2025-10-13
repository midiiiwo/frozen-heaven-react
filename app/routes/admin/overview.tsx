import { Link } from "react-router";
import type { Route } from "./+types/overview";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Admin Dashboard - Frozen Haven" }];
}

export default function AdminOverview() {
  const stats = [
    {
      label: "Total Products",
      value: "125",
      description: "Active inventory items",
      trend: "+12%",
      trendUp: true,
      color: "blue",
    },
    {
      label: "Low Stock Alert",
      value: "8",
      description: "Items below threshold",
      color: "orange",
    },
    {
      label: "Out of Stock",
      value: "3",
      description: "Requires restocking",
      color: "red",
    },
    {
      label: "Pending Orders",
      value: "23",
      description: "Awaiting processing",
      trend: "-5%",
      trendUp: false,
      color: "purple",
    },
  ];

  const revenueStats = [
    {
      label: "Today's Revenue",
      value: "GHC 15,750",
      description: "vs yesterday",
      trend: "+8.5%",
      trendUp: true,
    },
    {
      label: "Monthly Revenue",
      value: "GHC 487,500",
      description: "vs last month",
      trend: "+15.3%",
      trendUp: true,
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Full Chicken",
      category: "Poultry",
      quantitySold: 156,
      revenue: 31200,
    },
    {
      id: 2,
      name: "Salmon",
      category: "SeaFood",
      quantitySold: 89,
      revenue: 31150,
    },
    {
      id: 3,
      name: "Gizzard",
      category: "Meat",
      quantitySold: 134,
      revenue: 20100,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${stat.color === "blue" ? "bg-blue-100 text-blue-600" : ""}
                ${stat.color === "orange" ? "bg-orange-100 text-orange-600" : ""}
                ${stat.color === "red" ? "bg-red-100 text-red-600" : ""}
                ${stat.color === "purple" ? "bg-purple-100 text-purple-600" : ""}
              `}
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              {stat.trend && (
                <span
                  className={`text-sm font-semibold ${stat.trendUp ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500 text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {revenueStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-[#1b4b27] mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500 text-xs">{stat.description}</p>
          </div>
        ))}

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block w-full px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors text-sm font-medium text-center"
            >
              Add New Product
            </Link>
            <Link
              to="/admin/stock"
              className="block w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium text-center"
            >
              Check Low Stock
            </Link>
            <Link
              to="/admin/stock"
              className="block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium text-center"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Top Selling Products
            </h2>
            <p className="text-gray-600 text-sm">
              Best performing items this month
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Quantity Sold
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">ID: {product.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                        {product.quantitySold}
                      </span>
                      <span className="text-sm text-gray-500">units</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#1b4b27]">
                      GHC {product.revenue.toLocaleString()}
                    </p>
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
