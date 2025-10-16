import { useState } from "react";
import type { Route } from "./+types/categories";
import { useGetCategories } from "../../hooks/useCetegory";
import { useGetProducts } from "../../hooks/useProducts";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks/useCetegory";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Categories - Admin - Frozen Haven" }];
}

export default function AdminCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: products, isLoading: productsLoading } = useGetProducts();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const isLoading = categoriesLoading || productsLoading;

  const categoriesWithCount = (categories || []).map((category) => ({
    ...category,
    productCount:
      products?.filter((p) => p.category === category.name).length || 0,
  }));

  const filteredCategories = categoriesWithCount.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }

    if (editingCategory) {
      updateMutation.mutate(
        {
          id: editingCategory.id!,
          category: formData,
        },
        {
          onSuccess: () => {
            alert("Category updated successfully!");
            handleCloseModal();
          },
          onError: () => {
            alert("Failed to update category");
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          alert("Category created successfully!");
          handleCloseModal();
        },
        onError: () => {
          alert("Failed to create category");
        },
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const productCount =
      products?.filter((p) => p.category === name).length || 0;

    if (productCount > 0) {
      alert(
        `Cannot delete "${name}" category. It has ${productCount} products. Please reassign or delete those products first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}" category?`)) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        alert("Category deleted successfully!");
      },
      onError: () => {
        alert("Failed to delete category");
      },
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage product categories and organization
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium"
        >
          Add New Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
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
          <p className="text-gray-600">Loading categories...</p>
        </div>
      )}

      {!isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  Active
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-gray-600 text-sm mb-2">
                  {category.description}
                </p>
              )}

              <p className="text-gray-600 text-sm mb-4">
                {category.productCount} products in this category
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id!, category.name)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredCategories.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No categories found</p>
        </div>
      )}

      {!isLoading && categoriesWithCount.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Category Statistics
          </h2>
          <div className="space-y-4">
            {categoriesWithCount.map((category) => (
              <div key={category.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.productCount} products (
                      {products && products.length > 0
                        ? (
                            (category.productCount / products.length) *
                            100
                          ).toFixed(1)
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1b4b27] h-2 rounded-full transition-all"
                      style={{
                        width: `${products && products.length > 0 ? (category.productCount / products.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
