import {
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  getOrdersByCustomer,
  getOrderStatistics,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from "../api/orders";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useGetOrdersByStatus = (status: Order["status"]) => {
  return useQuery({
    queryKey: ["orders", "status", status],
    queryFn: () => getOrdersByStatus(status),
    enabled: !!status,
  });
};

export const useGetOrdersByCustomer = (customerEmail: string) => {
  return useQuery({
    queryKey: ["orders", "customer", customerEmail],
    queryFn: () => getOrdersByCustomer(customerEmail),
    enabled: !!customerEmail,
  });
};

export const useGetOrderStatistics = () => {
  return useQuery({
    queryKey: ["orders", "statistics"],
    queryFn: getOrderStatistics,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: Omit<Order, "id">) => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "statistics"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, order }: { id: string; order: Partial<Order> }) =>
      updateOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "statistics"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "statistics"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "statistics"] });
    },
  });
};
