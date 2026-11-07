import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  getSession,
  googleOAuth,
  refreshToken,
  requestAccountRestore,
  resendForgotPasswordOtp,
  resendRegistrationOtp,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
  verifyAccountRestore,
} from "@/api";
import { getErrorStatus } from "@/lib/utils";

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}

export function useResendRegistrationOtp() {
  return useMutation({
    mutationFn: resendRegistrationOtp,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["USER"] });
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["USER"],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        if (getErrorStatus(error) !== 401) {
          throw error;
        }

        try {
          await refreshToken();
        } catch {
          throw error;
        }

        return getMe();
      }
    },
    retry: false,
  });
}

export function useGetSession() {
  return useQuery({
    queryKey: ["SESSION"],
    queryFn: getSession,
    retry: false,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResendForgotPasswordOtp() {
  return useMutation({
    mutationFn: resendForgotPasswordOtp,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useRequestAccountRestore() {
  return useMutation({
    mutationFn: requestAccountRestore,
  });
}

export function useVerifyAccountRestore() {
  return useMutation({
    mutationFn: verifyAccountRestore,
  });
}
