import { useQuery } from "@tanstack/react-query";
import {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Get all customers
export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get customer by ID
export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

// Get customer by email
export const useGetCustomerByEmail = (email: string) => {
  return useQuery({
    queryKey: ["customer", "email", email],
    queryFn: () => getCustomerByEmail(email),
    enabled: !!email,
  });
};

// Create customer mutation
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: Omit<Customer, "id">) => createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// Update customer mutation
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      customer,
    }: {
      id: string;
      customer: Partial<Customer>;
    }) => updateCustomer(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// Delete customer mutation
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
