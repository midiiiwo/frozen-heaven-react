import { useState } from "react";
import type { Route } from "./+types/orders";
import {
  useGetOrders,
  useGetOrderStatistics,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "../../hooks/useOrders";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useConfirmationModal } from "~/hooks/useConfirmationModal";
import ConfirmationModal from "~/components/ConfirmationDialog";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Orders - Admin - Frozen Haven" }];
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | Order["status"] | "pay_later"
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { modalProps, showConfirmation } = useConfirmationModal();

  const { data: orders, isLoading, error } = useGetOrders();
  const { data: stats } = useGetOrderStatistics();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const filteredOrders =
    orders?.filter((order) => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pay_later":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    showConfirmation({
      title: "Change Order Status",
      message: `Are you sure you want to change the order status to ${newStatus}?`,
      variant: "default",
      onConfirm: () => {
        return new Promise((resolve, reject) => {
          updateOrderStatus.mutate(
            { id: orderId, status: newStatus },
            {
              onSuccess: () => {
                toast.success("Order status updated successfully!");
                resolve();
              },
              onError: () => {
                toast.error("Failed to update order status. Please try again.");
                reject();
              },
            }
          );
        });
      },
    });
  };

  const handleConfirmPayment = (orderId: string) => {
    showConfirmation({
      title: "Confirm Payment",
      message:
        "Confirm that payment has been received and update order to pending?",
      variant: "success",
      confirmText: "Confirm Payment",
      onConfirm: () => {
        return new Promise((resolve, reject) => {
          updateOrderStatus.mutate(
            { id: orderId, status: "pending" },
            {
              onSuccess: () => {
                toast.success(
                  "Payment confirmed! Order status updated to pending."
                );
                resolve();
              },
              onError: () => {
                toast.error("Failed to confirm payment. Please try again.");
                reject();
              },
            }
          );
        });
      },
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    showConfirmation({
      title: "Delete Order",
      message:
        "Are you sure you want to delete this order? This action cannot be undone.",
      variant: "danger",
      confirmText: "Delete Order",
      onConfirm: () => {
        return new Promise((resolve, reject) => {
          deleteOrder.mutate(orderId, {
            onSuccess: () => {
              toast.success("Order deleted successfully!");
              setSelectedOrder(null);
              resolve();
            },
            onError: () => {
              toast.error("Failed to delete order. Please try again.");
              reject();
            },
          });
        });
      },
    });
  };

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-red-700">
            Failed to load orders. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <ConfirmationModal {...modalProps} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Orders</span>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
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
            {stats?.total || 0}
          </h3>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Awaiting Payment</span>
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats?.pay_later || 0}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Payment pending</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending</span>
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats?.pending || 0}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Awaiting action</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Processing</span>
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats?.processing || 0}
          </h3>
          <p className="text-sm text-gray-500 mt-1">In progress</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
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
            {stats?.completed || 0}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Delivered</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6 inline-flex gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setStatusFilter("pay_later")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === "pay_later"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Awaiting Payment
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === "pending"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter("processing")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === "processing"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            statusFilter === "completed"
              ? "bg-[#1b4b27] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#1b4b27]"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Items
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Total
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
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">
                          {order.id?.slice(0, 8)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                            {order.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">
                          {order.items.length} items
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#1b4b27]">
                          GHC {order.total}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status === "pay_later"
                            ? "Awaiting Payment"
                            : order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View details"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>

                          {/* Confirm Payment Button for pay_later status */}
                          {order.status === "pay_later" && (
                            <button
                              onClick={() => handleConfirmPayment(order.id!)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Confirm Payment"
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
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          )}

                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusChange(order.id!, "processing")
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Mark as processing"
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
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </button>
                          )}
                          {order.status === "processing" && (
                            <button
                              onClick={() =>
                                handleStatusChange(order.id!, "completed")
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Mark as completed"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          {order.status !== "cancelled" &&
                            order.status !== "pay_later" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(order.id!, "cancelled")
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Cancel order"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
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

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">
                    {selectedOrder.id?.slice(0, 8)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status === "pay_later"
                      ? "Awaiting Payment"
                      : selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-semibold">{selectedOrder.customerAddress}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        GHC {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    GHC {selectedOrder.subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    GHC {selectedOrder.deliveryFee}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-[#1b4b27]">
                    GHC {selectedOrder.total}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {selectedOrder.status === "pay_later" && (
                  <button
                    onClick={() => {
                      handleConfirmPayment(selectedOrder.id!);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Confirm Payment
                  </button>
                )}
                {selectedOrder.status === "pending" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id!, "processing");
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Mark as Processing
                  </button>
                )}
                {selectedOrder.status === "processing" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id!, "completed");
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                )}
                {selectedOrder.status !== "cancelled" &&
                  selectedOrder.status !== "pay_later" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id!, "cancelled");
                        setSelectedOrder(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id!)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
