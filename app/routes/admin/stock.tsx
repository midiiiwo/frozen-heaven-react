import { useState, useMemo } from "react";
import type { Route } from "./+types/stock";
import { useGetProducts, useUpdateProductStock } from "../../hooks/useProducts";
import { getProductImage } from "../../lib/imageHelper";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Stock Management - Admin - Frozen Haven" }];
}

export default function AdminStock() {
  const [filter, setFilter] = useState("all");
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState("");

  // Fetch products
  const { data: products, isLoading } = useGetProducts();
  const updateStockMutation = useUpdateProductStock();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      if (filter === "low") return product.stock > 0 && product.stock <= 10;
      if (filter === "out") return product.stock === 0;
      if (filter === "good") return product.stock > 10;
      return true;
    });
  }, [products, filter]);

  const stats = useMemo(() => {
    if (!products)
      return { inStock: 0, lowStock: 0, outOfStock: 0, totalValue: 0 };

    return {
      inStock: products.filter((p) => p.stock > 10).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    };
  }, [products]);

  const handleRestockClick = (product: Product) => {
    setRestockProduct(product);
    setNewStock(product.stock.toString());
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!restockProduct) return;

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    updateStockMutation.mutate(
      {
        id: restockProduct.id!,
        stock: stockValue,
      },
      {
        onSuccess: () => {
          alert("Stock updated successfully!");
          setRestockProduct(null);
          setNewStock("");
        },
        onError: () => {
          alert("Failed to update stock");
        },
      }
    );
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stock Management
        </h1>
        <p className="text-gray-600">Monitor and manage inventory levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">In Stock</span>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : stats.inStock}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Products available</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Low Stock</span>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : stats.lowStock}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Need restocking</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Out of Stock</span>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
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
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : stats.outOfStock}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Urgent action needed</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Value</span>
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
            {isLoading ? "..." : `GHC ${stats.totalValue.toLocaleString()}`}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Inventory value</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6 inline-flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          All Products ({products?.length || 0})
        </button>
        <button
          onClick={() => setFilter("good")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "good"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          In Stock ({stats.inStock})
        </button>
        <button
          onClick={() => setFilter("low")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "low"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Low Stock ({stats.lowStock})
        </button>
        <button
          onClick={() => setFilter("out")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "out"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Out of Stock ({stats.outOfStock})
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Stock Table */}
      {!isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Current Stock
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Stock Value
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(product.imageName)}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-sm font-bold rounded ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                        <span className="text-sm text-gray-500">units</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        GHC {product.price}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#1b4b27]">
                        GHC {(product.price * product.stock).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleRestockClick(product)}
                        className="px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors text-sm font-medium"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No products found in this category
              </p>
            </div>
          )}
        </div>
      )}

      {/* Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Update Stock - {restockProduct.name}
            </h2>

            <form onSubmit={handleRestockSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <p className="text-lg font-bold text-gray-900">
                    {restockProduct.stock} units
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setRestockProduct(null);
                    setNewStock("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStockMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors disabled:opacity-50"
                >
                  {updateStockMutation.isPending
                    ? "Updating..."
                    : "Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
