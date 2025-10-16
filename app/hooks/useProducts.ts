import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "../api/products";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useGetProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, "id">) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateProductStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
