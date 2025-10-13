import type { Route } from "./+types/analytics";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Analytics - Admin - Frozen Haven" }];
}

export default function AdminAnalytics() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Track your store's performance and insights
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Sales chart visualization</p>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Revenue by Category
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Category revenue chart</p>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Customer Growth
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Customer growth chart</p>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Popular Products
          </h3>
          <div className="space-y-3">
            {["Full Chicken", "Salmon", "Gizzard", "Goat Meat"].map(
              (product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{product}</span>
                  <span className="text-sm text-gray-600">
                    {Math.floor(Math.random() * 200 + 50)} sales
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Average Order Value</p>
          <h3 className="text-2xl font-bold text-gray-900">GHC 435</h3>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total Customers</p>
          <h3 className="text-2xl font-bold text-gray-900">342</h3>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-gray-900">3.2%</h3>
          <p className="text-sm text-red-600 mt-2">-2% from last month</p>
        </div>
      </div>
    </div>
  );
}
