import { Link } from "react-router";
import type { Route } from "./+types/overview";
import { useGetProducts } from "../../hooks/useProducts";
import { useGetOrderStatistics, useGetOrders } from "../../hooks/useOrders";
import { useMemo } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Admin Dashboard - Frozen Haven" }];
}

export default function AdminOverview() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: orderStats, isLoading: statsLoading } = useGetOrderStatistics();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();

  const productStats = useMemo(() => {
    if (!products) return { total: 0, lowStock: 0, outOfStock: 0 };

    return {
      total: products.length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
    };
  }, [products]);

  const topProducts = useMemo(() => {
    if (!orders) return [];

    const productSales = new Map<
      string,
      { name: string; category: string; quantity: number; revenue: number }
    >();

    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        order.items.forEach((item) => {
          const existing = productSales.get(item.id);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.price * item.quantity;
          } else {
            productSales.set(item.id, {
              name: item.name,
              category: item.category,
              quantity: item.quantity,
              revenue: item.price * item.quantity,
            });
          }
        });
      });

    return Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const isLoading = productsLoading || statsLoading || ordersLoading;

  const stats = [
    {
      label: "Total Products",
      value: isLoading ? "..." : productStats.total.toString(),
      description: "Active inventory items",
      color: "blue",
    },
    {
      label: "Low Stock Alert",
      value: isLoading ? "..." : productStats.lowStock.toString(),
      description: "Items below threshold",
      color: "orange",
    },
    {
      label: "Out of Stock",
      value: isLoading ? "..." : productStats.outOfStock.toString(),
      description: "Requires restocking",
      color: "red",
    },
    {
      label: "Pending Orders",
      value: isLoading ? "..." : (orderStats?.pending || 0).toString(),
      description: "Awaiting processing",
      color: "purple",
    },
  ];

  const revenueStats = [
    {
      label: "Total Revenue",
      value: isLoading
        ? "GHC ..."
        : `GHC ${orderStats?.totalRevenue.toLocaleString() || 0}`,
      description: "From completed orders",
    },
    {
      label: "Total Orders",
      value: isLoading ? "..." : (orderStats?.total || 0).toString(),
      description: "All time",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

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

              {
                //@ts-ignore
                stat.trend && (
                  <span
                    //@ts-ignore
                    className={`text-sm font-semibold ${stat.trendUp ? "text-green-600" : "text-red-600"}`}
                  >
                    {
                      //@ts-ignore
                      stat.trend
                    }
                  </span>
                )
              }
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500 text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

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
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-[#1b4b27] mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500 text-xs">{stat.description}</p>
          </div>
        ))}

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
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Loading top products...
                  </td>
                </tr>
              ) : topProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No sales data available yet. Complete some orders to see top
                    selling products.
                  </td>
                </tr>
              ) : (
                topProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {product.id.slice(0, 8)}
                        </p>
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
                          {product.quantity}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
