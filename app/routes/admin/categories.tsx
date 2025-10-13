import type { Route } from "./+types/categories";
import { categories } from "../../data/products";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Categories - Admin - Frozen Haven" }];
}

export default function AdminCategories() {
  const categoryData = categories
    .filter((cat) => cat !== "All")
    .map((cat, idx) => ({
      name: cat,
      productCount: Math.floor(Math.random() * 20 + 5),
      color: [
        "blue",
        "green",
        "yellow",
        "purple",
        "pink",
        "indigo",
        "red",
        "orange",
      ][idx % 8],
    }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Categories
            </h1>
            <p className="text-gray-600">Manage product categories</p>
          </div>
          <button className="px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium">
            + Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.map((category, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${category.color === "blue" ? "bg-blue-100 text-blue-600" : ""}
                ${category.color === "green" ? "bg-green-100 text-green-600" : ""}
                ${category.color === "yellow" ? "bg-yellow-100 text-yellow-600" : ""}
                ${category.color === "purple" ? "bg-purple-100 text-purple-600" : ""}
                ${category.color === "pink" ? "bg-pink-100 text-pink-600" : ""}
                ${category.color === "indigo" ? "bg-indigo-100 text-indigo-600" : ""}
                ${category.color === "red" ? "bg-red-100 text-red-600" : ""}
                ${category.color === "orange" ? "bg-orange-100 text-orange-600" : ""}
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
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
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {category.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {category.productCount} products
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
