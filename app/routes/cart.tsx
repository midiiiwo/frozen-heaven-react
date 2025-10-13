import { Link, useNavigate } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/cart";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCartStore } from "../stores/cartStore";
import { useCreateOrder } from "../hooks/useOrders";
import { getProductById, updateProductStock } from "../api/products";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cart - Frozen Haven" },
    { name: "description", content: "Your shopping cart" },
  ];
}

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile_money"
  >("cash");

  const createOrderMutation = useCreateOrder();

  const handleCheckout = async () => {
    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address
    ) {
      alert("Please fill in all customer information");
      return;
    }

    // Validate stock availability
    try {
      for (const item of items) {
        const product = await getProductById(item.id!);
        if (!product) {
          alert(
            `Product "${item.name}" not found. Please refresh and try again.`
          );
          return;
        }
        if (product.stock < item.quantity) {
          alert(
            `Insufficient stock for "${item.name}". Only ${product.stock} available.`
          );
          return;
        }
      }
    } catch (error) {
      alert("Failed to validate stock. Please try again.");
      return;
    }

    const subtotal = getTotalPrice();
    const deliveryFee = 20;
    const total = subtotal + deliveryFee;

    const orderData: Omit<Order, "id"> = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items: items.map((item) => ({
        ...item,
        id: String(item.id),
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      status: "pending",
    };

    try {
      const result = await createOrderMutation.mutateAsync(orderData);

      if (result) {
        // Update product stock after successful order
        for (const item of items) {
          const product = await getProductById(item.id!);
          if (product) {
            await updateProductStock(item.id!, product.stock - item.quantity);
          }
        }

        alert("Order placed successfully! Order ID: " + result.id);
        clearCart();
        setShowCheckout(false);
        navigate("/shop");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50 flex items-center justify-center py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Start adding some delicious frozen foods to your cart
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex gap-6">
                    <img
                      src={`/assets/products/${item.imageName}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "/images/default-product.png";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium mt-1">
                            {item.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
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
                      <p className="text-gray-600 text-sm mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            GHC {item.price} each
                          </p>
                          <p className="text-xl font-bold text-[#1b4b27]">
                            GHC {item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                {!showCheckout ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          GHC {getTotalPrice()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold text-gray-900">
                          GHC 20
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            Total
                          </span>
                          <span className="text-2xl font-bold text-[#1b4b27]">
                            GHC {getTotalPrice() + 20}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full px-6 py-3 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium"
                    >
                      Proceed to Checkout
                    </button>
                    <Link
                      to="/shop"
                      className="block w-full px-6 py-3 mt-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-center"
                    >
                      Continue Shopping
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Checkout Details
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Address
                        </label>
                        <textarea
                          value={customerInfo.address}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                          rows={3}
                          placeholder="Your delivery address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as "cash" | "card" | "mobile_money"
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
                        >
                          <option value="cash">Cash on Delivery</option>
                          <option value="mobile_money">Mobile Money</option>
                          <option value="card">Card (Coming Soon)</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">
                          GHC {getTotalPrice()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-semibold">GHC 20</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-xl font-bold text-[#1b4b27]">
                          GHC {getTotalPrice() + 20}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={createOrderMutation.isPending}
                      className="w-full px-6 py-3 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium disabled:opacity-50"
                    >
                      {createOrderMutation.isPending
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="block w-full px-6 py-3 mt-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-center"
                    >
                      Back to Summary
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
