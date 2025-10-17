import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCartStore } from "../stores/cartStore";
import { useCreateOrder } from "../hooks/useOrders";
import { getProductById, updateProductStock } from "../api/products";
import { getProductImage } from "~/lib/imageHelper";

export function meta() {
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
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile_money">(
    "cash"
  );
  const [orderId, setOrderId] = useState("");

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

    const orderData = {
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
      status: paymentMethod === "mobile_money" ? "pay_later" : "pending",
    };

    try {
      //@ts-ignore
      const result = await createOrderMutation.mutateAsync(orderData);

      if (result) {
        for (const item of items) {
          const product = await getProductById(item.id!);
          if (product) {
            await updateProductStock(item.id!, product.stock - item.quantity);
          }
        }

        if (paymentMethod === "mobile_money") {
          setOrderId(result.id);
        } else {
          alert("Order placed successfully! Order ID: " + result.id);
          clearCart();
          setShowCheckout(false);
          navigate("/shop");
        }
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  const handleWhatsAppConfirm = () => {
    const message = `Hello, I've completed payment for Order #${orderId}. Total: GHC ${getTotalPrice() + 20}`;
    const whatsappUrl = `https://wa.me/233556951489?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      navigate("/shop");
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 bg-gray-50 flex items-center justify-center py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-600" // Changed from text-gray-400 to text-gray-600 for better visibility
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
              <p className="text-gray-700 text-lg mb-8">
                {" "}
                {/* Changed from text-gray-600 to text-gray-700 */}
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {" "}
      {/* Changed from default to bg-gray-50 */}
      <Header />
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-700">
                {" "}
                {/* Changed from text-gray-600 to text-gray-700 */}
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
                      src={getProductImage(item.imageName)}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
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
                      <p className="text-gray-700 text-sm mb-4">
                        {" "}
                        {/* Changed from text-gray-600 to text-gray-700 */}
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
                              className="w-4 h-4 text-gray-700" // Added text color
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
                              className="w-4 h-4 text-gray-700" // Added text color
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
                          <p className="text-sm text-gray-700">
                            {" "}
                            {/* Changed from text-gray-600 to text-gray-700 */}
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
                        <span className="text-gray-700">Subtotal</span>{" "}
                        {/* Changed from text-gray-600 */}
                        <span className="font-semibold text-gray-900">
                          GHC {getTotalPrice()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Delivery Fee</span>{" "}
                        {/* Changed from text-gray-600 */}
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
                ) : orderId ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Order Created!
                      </h2>
                      <p className="text-gray-700 text-sm mb-4">
                        {" "}
                        {/* Changed from text-gray-600 */}
                        Order #{orderId}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Payment Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Name:</span>{" "}
                          {/* Changed from text-gray-600 */}
                          <span className="font-medium text-gray-900">
                            FROZEN HAVEN
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700"></span>{" "}
                          {/* Changed from text-gray-600 */}
                          <span className="font-medium text-gray-900">
                            KOMBIAN KINANSUAH IBRAHIM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">MoMo Pay ID:</span>{" "}
                          {/* Changed from text-gray-600 */}
                          <span className="font-bold text-blue-900">
                            096942
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">MoMo Number:</span>{" "}
                          {/* Changed from text-gray-600 */}
                          <span className="font-bold text-blue-900">
                            0556951489
                          </span>
                        </div>
                        <div className="border-t border-blue-200 pt-2 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-700">
                              Amount to Pay:
                            </span>{" "}
                            {/* Changed from text-gray-600 */}
                            <span className="font-bold text-lg text-[#1b4b27]">
                              GHC {getTotalPrice() + 20}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Instructions
                      </h3>
                      <ol className="text-sm text-gray-800 space-y-2 list-decimal list-inside">
                        {" "}
                        {/* Changed from text-gray-700 to text-gray-800 */}
                        <li>
                          Send GHC {getTotalPrice() + 20} to the mobile money
                          number above
                        </li>
                        <li>Take a screenshot of the transaction</li>
                        <li>Click the button below to send via WhatsApp</li>
                        <li>Include your Order #{orderId} in the message</li>
                      </ol>
                    </div>

                    <button
                      onClick={handleWhatsAppConfirm}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Send via WhatsApp
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Checkout Details
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {" "}
                          {/* Changed from text-gray-700 to text-gray-900 */}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900" // Added text-gray-900
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {" "}
                          {/* Changed from text-gray-700 to text-gray-900 */}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900" // Added text-gray-900
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {" "}
                          {/* Changed from text-gray-700 to text-gray-900 */}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900" // Added text-gray-900
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {" "}
                          {/* Changed from text-gray-700 to text-gray-900 */}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27] text-gray-900" // Added text-gray-900
                          rows={3}
                          placeholder="Your delivery address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          {" "}
                          {/* Changed from text-gray-700 to text-gray-900 */}
                          Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cash")}
                            className={`p-4 border-2 rounded-lg transition-all ${
                              paymentMethod === "cash"
                                ? "border-[#1b4b27] bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <svg
                                className="w-8 h-8 text-gray-900" // Changed from text-gray-700 to text-gray-900
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span className="text-sm font-medium text-gray-900">
                                {" "}
                                {/* Added text-gray-900 */}
                                Cash on Delivery
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("mobile_money")}
                            className={`p-4 border-2 rounded-lg transition-all ${
                              paymentMethod === "mobile_money"
                                ? "border-[#1b4b27] bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <svg
                                className="w-8 h-8 text-gray-900" // Changed from text-gray-700 to text-gray-900
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm font-medium text-gray-900">
                                {" "}
                                {/* Added text-gray-900 */}
                                Mobile Money
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Subtotal</span>{" "}
                        {/* Changed from text-gray-600 */}
                        <span className="font-semibold text-gray-900">
                          GHC {getTotalPrice()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Delivery</span>{" "}
                        {/* Changed from text-gray-600 */}
                        <span className="font-semibold text-gray-900">
                          GHC 20
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          Total
                        </span>
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
                        : paymentMethod === "mobile_money"
                          ? "Continue to Payment"
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
