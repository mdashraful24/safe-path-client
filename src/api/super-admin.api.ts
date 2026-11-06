import apiClient from "@/lib/apiClient";
import type {
  AdminListQuery,
  AdminRejectPayload,
  ApiResponse,
  ApproveChangeRequestResult,
  ChangeRequestItem,
  ChangeRequestListQuery,
  UpdateUserRolePayload,
  User,
} from "@/types";

export function listAdmins(query: AdminListQuery = {}) {
  return apiClient<ApiResponse<User[]>>("/super-admin/admins", { query });
}

export function updateUserRole(userId: string, payload: UpdateUserRolePayload) {
  return apiClient<ApiResponse<User>>(`/super-admin/users/${userId}/role`, {
    method: "PATCH",
    body: payload,
  });
}

export function listChangeRequests(query: ChangeRequestListQuery = {}) {
  return apiClient<ApiResponse<ChangeRequestItem[]>>(
    "/super-admin/change-requests",
    { query },
  );
}

export function approveChangeRequest(requestId: string) {
  return apiClient<ApiResponse<ApproveChangeRequestResult>>(
    `/super-admin/change-requests/${requestId}/approve`,
    { method: "PATCH" },
  );
}

export function rejectChangeRequest(
  requestId: string,
  payload: AdminRejectPayload,
) {
  return apiClient<ApiResponse<ApproveChangeRequestResult>>(
    `/super-admin/change-requests/${requestId}/reject`,
    { method: "PATCH", body: payload },
  );
}
