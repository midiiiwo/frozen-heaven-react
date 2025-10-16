import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "../api/auth";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: ({ email, pin }: { email: string; pin: string }) =>
      loginAdmin(email, pin),
  });
};
