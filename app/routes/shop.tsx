import { useState, useMemo } from "react";
import type { Route } from "./+types/shop";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCartStore } from "../stores/cartStore";
import { useGetProducts } from "../hooks/useProducts";
import { getProductImage } from "../lib/imageHelper";
import toast from "react-hot-toast";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shop - Frozen Haven" },
    {
      name: "description",
      content: "Browse our selection of fresh and affordable frozen foods",
    },
  ];
}

export default function Shop() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("all");

  const { data: products, isLoading, error } = useGetProducts();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

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
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      let matchesPrice = true;
      if (priceRange === "0-50") {
        matchesPrice = product.price >= 0 && product.price <= 50;
      } else if (priceRange === "50-100") {
        matchesPrice = product.price > 50 && product.price <= 100;
      } else if (priceRange === "100+") {
        matchesPrice = product.price > 100;
      }

      return matchesCategory && matchesPrice && product.stock > 0;
    });
  }, [products, selectedCategory, priceRange]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Products
            </h2>
            <p className="text-gray-600">
              Please try again later or contact support.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
              <p className="text-gray-600">
                Browse our selection of fresh and affordable frozen foods
              </p>
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            >
              <option value="all">All Prices</option>
              <option value="0-50">GHC 0 - 50</option>
              <option value="50-100">GHC 50 - 100</option>
              <option value="100+">GHC 100+</option>
            </select>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-6 h-6 text-[#1b4b27]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-gray-900">Category</h2>
                </div>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                        selectedCategory === category
                          ? "bg-green-100 text-[#1b4b27] font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-[#1b4b27] focus:ring-[#1b4b27]"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No products found matching your filters.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={getProductImage(product.imageName)}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            GHC {product.price}
                          </span>
                          <span className="text-sm text-gray-600">
                            Stock: {product.stock}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {product.stock === 0 ? "Out of Stock" : "Add to cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
