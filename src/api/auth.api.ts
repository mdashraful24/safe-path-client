import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthTokens,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  OtpResponse,
  RegistrationPayload,
  ResendRegistrationOtpPayload,
  ResetPasswordPayload,
  RestoreAccountPayload,
  User,
  VerifyAccountPayload,
  VerifyRestorePayload,
} from "@/types";

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<OtpResponse>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<null>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function resendRegistrationOtp(payload: ResendRegistrationOtpPayload) {
  return apiClient<ApiResponse<OtpResponse>>("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function googleOAuth(payload: GoogleLoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/auth/me");
}

export function getSession() {
  return apiClient<ApiResponse<User | null>>("/auth/session");
}

export function refreshToken() {
  return apiClient<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    method: "POST",
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<OtpResponse>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resendForgotPasswordOtp(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<OtpResponse>>(
    "/auth/resend-forgot-password-otp",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function requestAccountRestore(payload: RestoreAccountPayload) {
  return apiClient<ApiResponse<OtpResponse>>("/auth/restore/request", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccountRestore(payload: VerifyRestorePayload) {
  return apiClient<ApiResponse<User>>("/auth/restore/verify", {
    method: "POST",
    body: payload,
  });
}
