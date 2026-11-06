import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
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
  return useMutation({
    mutationFn: userLogout,
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
