import { useState, useMemo } from "react";
import type { Route } from "./+types/products";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/useProducts";
import { getProductImage } from "../../lib/imageHelper";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Products - Admin - Frozen Haven" }];
}

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading, error } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category))
    );
    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleDeleteProduct = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      deleteProduct.mutate(id, {
        onSuccess: () => {
          alert("Product deleted successfully!");
        },
        onError: () => {
          alert("Failed to delete product. Please try again.");
        },
      });
    }
  };

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Error Loading Products
          </h2>
          <p className="text-red-700">
            Failed to load products. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Manage your product inventory and pricing
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name..."
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#1b4b27]"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
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
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Stock
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
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {product.id?.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#1b4b27]">
                          GHC {product.price}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded ${
                              product.stock > 30
                                ? "bg-green-100 text-green-800"
                                : product.stock > 10
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
                        {product.stock > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit product"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(product.id!, product.name)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete product"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </>
        )}
      </div>

      {(showAddModal || showEditModal) && (
        <ProductFormModal
          isEdit={showEditModal}
          product={selectedProduct}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSubmit={(productData) => {
            if (showEditModal && selectedProduct) {
              updateProduct.mutate(
                { id: selectedProduct.id!, product: productData },
                {
                  onSuccess: () => {
                    alert("Product updated successfully!");
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  },
                  onError: () => {
                    alert("Failed to update product. Please try again.");
                  },
                }
              );
            } else {
              createProduct.mutate(productData, {
                onSuccess: () => {
                  alert("Product created successfully!");
                  setShowAddModal(false);
                },
                onError: () => {
                  alert("Failed to create product. Please try again.");
                },
              });
            }
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  isEdit,
  product,
  onClose,
  onSubmit,
}: {
  isEdit: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    description: product?.description || "",
    imageName: product?.imageName || "",
    stock: product?.stock || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price <= 0) {
      alert("Please fill in all required fields correctly");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900 placeholder:text-gray-500"
                placeholder="e.g., Layer Chicken"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900 placeholder:text-gray-500"
                placeholder="e.g., Poultry"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (GHC) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900 placeholder:text-gray-500"
                rows={3}
                placeholder="Product description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Name
              </label>
              <input
                type="text"
                value={formData.imageName}
                onChange={(e) =>
                  setFormData({ ...formData, imageName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900 placeholder:text-gray-500"
                placeholder="e.g., chicken-wings.png"
              />
              <p className="mt-1 text-sm text-gray-500">
                Image filename only (e.g., product.png). Images should be placed
                in /public/assets/products/
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820]"
            >
              {isEdit ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
