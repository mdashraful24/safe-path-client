import apiClient from "@/lib/apiClient";
import type { ApiResponse, User } from "@/types";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

function buildProfileBody(payload: UpdateProfilePayload, image?: File) {
  const body = new FormData();

  if (payload.name) body.append("name", payload.name);
  if (payload.email) body.append("email", payload.email);
  if (payload.currentPassword) {
    body.append("currentPassword", payload.currentPassword);
  }
  if (payload.newPassword) body.append("newPassword", payload.newPassword);
  if (image) body.append("image", image);

  return body;
}

export function getMyProfile() {
  return apiClient<ApiResponse<User>>("/users/me");
}

export function updateMyProfile(payload: UpdateProfilePayload, image?: File) {
  return apiClient<ApiResponse<User>>("/users/me", {
    method: "PATCH",
    body: buildProfileBody(payload, image),
  });
}

export function verifyEmailChange(otp: string) {
  return apiClient<ApiResponse<User>>("/users/me/email/verify", {
    method: "POST",
    body: { otp },
  });
}

export function removeProfileImage() {
  return apiClient<ApiResponse<User>>("/users/me/avatar", {
    method: "DELETE",
  });
}

export function requestAccountDeletion(reason?: string) {
  return apiClient<ApiResponse<null>>("/users/me", {
    method: "DELETE",
    body: { reason },
  });
}
