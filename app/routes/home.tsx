import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { products } from "../constants/products";
import { useCartStore } from "../stores/cartStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Frozen Haven - Fresh & Affordable Frozen Foods" },
    {
      name: "description",
      content:
        "Quality frozen products delivered to your doorstep. Shop from our wide selection of fresh meats, seafood, and more in Ghana.",
    },
  ];
}

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  const featuredProducts = products.slice(0, 4);
  const availableProducts = products.slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f8ba07] to-[#f8ba07]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Fresh & Affordable Frozen Foods
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Quality frozen products delivered to your doorstep. Shop from
                our wide selection of fresh meats, seafood, and more.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/shop"
                  className="px-6 py-3 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium"
                >
                  Shop Now
                </Link>
                <button className="px-6 py-3 border-2 border-[#1b4b27] text-[#1b4b27] rounded-md hover:bg-[#1b4b27] hover:text-white transition-colors font-medium">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://ext.same-assets.com/4027373722/4229952450.png"
                alt="Fresh frozen foods"
                className="rounded-lg shadow-2xl w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1b4b27] mb-12">
            Why Choose Frozen Haven?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1b4b27]"
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fresh Products
              </h3>
              <p className="text-gray-600">
                We source the freshest products to ensure quality and taste in
                every purchase.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1b4b27]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delivery Available
              </h3>
              <p className="text-gray-600">
                Convenient delivery service to bring your order right to your
                doorstep.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1b4b27]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quick Service
              </h3>
              <p className="text-gray-600">
                Fast and efficient service to save you time and ensure
                satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#1b4b27]">
              Featured Products
            </h2>
            <Link
              to="/shop"
              className="flex items-center gap-2 px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors"
            >
              View All
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      GHC {product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors text-sm font-medium"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Products */}
      <section className="py-16 bg-[#fad3aa]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1b4b27] mb-12">
            Available Products
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1b4b27] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Browse our selection of fresh and affordable frozen foods and have
            them delivered to your doorstep.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-white text-[#1b4b27] rounded-md hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
