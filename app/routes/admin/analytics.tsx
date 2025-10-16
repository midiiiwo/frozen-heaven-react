import type { Route } from "./+types/analytics";
import { useMemo } from "react";
import { useGetOrders } from "../../hooks/useOrders";
import { useGetProducts } from "../../hooks/useProducts";
import { useGetCustomers } from "../../hooks/useCustomer";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Analytics - Admin - Frozen Haven" }];
}

export default function AdminAnalytics() {
  const { data: orders, isLoading: ordersLoading } = useGetOrders();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: customers, isLoading: customersLoading } = useGetCustomers();

  const isLoading = ordersLoading || productsLoading || customersLoading;

  const analytics = useMemo(() => {
    if (!orders || !products) return null;

    const completedOrders = orders.filter((o) => o.status === "completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageOrder =
      totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

    const monthlyData = new Map<string, { revenue: number; orders: number }>();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    completedOrders.forEach((order) => {
      const date = order.createdAt ? new Date(order.createdAt) : new Date();
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, { revenue: 0, orders: 0 });
      }

      const data = monthlyData.get(monthYear)!;
      data.revenue += order.total;
      data.orders += 1;
    });

    const salesData = Array.from(monthlyData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .slice(-6);

    const categoryStats = new Map<string, { sales: number; revenue: number }>();

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.category || "Other";
        if (!categoryStats.has(category)) {
          categoryStats.set(category, { sales: 0, revenue: 0 });
        }
        const stats = categoryStats.get(category)!;
        stats.sales += item.quantity;
        stats.revenue += item.price * item.quantity;
      });
    });

    const totalCategoryRevenue = Array.from(categoryStats.values()).reduce(
      (sum, stat) => sum + stat.revenue,
      0
    );

    const topCategories = Array.from(categoryStats.entries())
      .map(([name, stats]) => ({
        name,
        sales: stats.sales,
        revenue: stats.revenue,
        percentage:
          totalCategoryRevenue > 0
            ? Math.round((stats.revenue / totalCategoryRevenue) * 100)
            : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      averageOrder,
      customerGrowth: customers?.length || 0,
      salesData:
        salesData.length > 0
          ? salesData
          : [{ month: "No data", revenue: 0, orders: 0 }],
      topCategories: topCategories.length > 0 ? topCategories : [],
    };
  }, [orders, products, customers]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-4" />
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            GHC {analytics.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 font-semibold mt-1">
            From completed orders
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Orders</span>
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {analytics.totalOrders}
          </h3>
          <p className="text-sm text-gray-600 font-semibold mt-1">All time</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Average Order</span>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            GHC {Math.round(analytics.averageOrder)}
          </h3>
          <p className="text-sm text-gray-600 font-semibold mt-1">
            Per completed order
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Customers</span>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {analytics.customerGrowth}
          </h3>
          <p className="text-sm text-gray-600 font-semibold mt-1">
            Registered customers
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Revenue Trend
          </h2>
          {analytics.salesData.length > 0 &&
          analytics.salesData[0].month !== "No data" ? (
            <div className="space-y-4">
              {analytics.salesData.map((data) => {
                const maxRevenue = Math.max(
                  ...analytics.salesData.map((d) => d.revenue)
                );
                return (
                  <div key={data.month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {data.month}
                      </span>
                      <span className="text-sm font-bold text-[#1b4b27]">
                        GHC {data.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#1b4b27] h-3 rounded-full transition-all"
                        style={{
                          width: `${maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No sales data available yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Orders by Month
          </h2>
          {analytics.salesData.length > 0 &&
          analytics.salesData[0].month !== "No data" ? (
            <div className="space-y-4">
              {analytics.salesData.map((data) => {
                const maxOrders = Math.max(
                  ...analytics.salesData.map((d) => d.orders)
                );
                return (
                  <div key={data.month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {data.month}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {data.orders} orders
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${maxOrders > 0 ? (data.orders / maxOrders) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No order data available yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Top Performing Categories
            </h2>
            <p className="text-gray-600 text-sm">
              Best selling product categories
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {analytics.topCategories.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Sales
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.topCategories.map((category) => (
                  <tr
                    key={category.name}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                        {category.sales}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#1b4b27]">
                        GHC {category.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-12">
                          {category.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No category data available yet</p>
              <p className="text-sm mt-2">
                Start selling to see category performance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
