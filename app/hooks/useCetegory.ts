import { useQuery } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
} from "../api/categories";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Omit<Category, "id">) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: string;
      category: Partial<Category>;
    }) => updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
