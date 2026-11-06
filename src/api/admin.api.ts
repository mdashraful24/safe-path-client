import apiClient from "@/lib/apiClient";
import type {
  AdminChangeRequestCreated,
  AdminChangeRequestPayload,
  AdminIncident,
  AdminIncidentDetail,
  AdminIncidentQuery,
  AdminReasonPayload,
  AdminUserListQuery,
  ApiResponse,
  DeletionRequestItem,
  DeletionRequestListQuery,
  IncidentComment,
  IncidentCommentListQuery,
  ReviewIncidentPayload,
  UpdateIncidentPayload,
  UpdateUserStatusPayload,
  User,
} from "@/types";

export function listUsers(query: AdminUserListQuery = {}) {
  return apiClient<ApiResponse<User[]>>("/admin/users", { query });
}

export function getUserDetails(userId: string) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}`);
}

export function updateUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function listDeletionRequests(query: DeletionRequestListQuery = {}) {
  return apiClient<ApiResponse<DeletionRequestItem[]>>(
    "/admin/users/deletion-requests",
    { query },
  );
}

export function approveAccountDeletion(userId: string) {
  return apiClient<ApiResponse<{ id: string; email: string }>>(
    `/admin/users/deletion-requests/${userId}/approve`,
    { method: "PATCH" },
  );
}

export function rejectAccountDeletion(
  userId: string,
  payload: AdminReasonPayload,
) {
  return apiClient<ApiResponse<{ id: string; email: string }>>(
    `/admin/users/deletion-requests/${userId}/reject`,
    { method: "PATCH", body: payload },
  );
}

export function restoreDeletedAccount(
  userId: string,
  payload: AdminReasonPayload,
) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}/restore`, {
    method: "PATCH",
    body: payload,
  });
}

export function createAdminChangeRequest(payload: AdminChangeRequestPayload) {
  return apiClient<ApiResponse<AdminChangeRequestCreated>>(
    "/admin/change-requests",
    { method: "POST", body: payload },
  );
}

export function listAdminIncidents(query: AdminIncidentQuery = {}) {
  return apiClient<ApiResponse<AdminIncident[]>>("/admin/incidents", {
    query,
  });
}

export function getAdminIncident(incidentId: string) {
  return apiClient<ApiResponse<AdminIncidentDetail>>(
    `/admin/incidents/${incidentId}`,
  );
}

function buildIncidentBody(payload: UpdateIncidentPayload, image?: File) {
  const body = new FormData();

  if (payload.title !== undefined) body.append("title", payload.title);
  if (payload.description !== undefined) {
    body.append("description", payload.description);
  }
  if (payload.category !== undefined) {
    body.append("category", payload.category);
  }
  if (payload.area !== undefined) body.append("area", payload.area);
  if (payload.location !== undefined) {
    body.append("location", payload.location);
  }
  if (payload.latitude !== undefined) {
    body.append("latitude", String(payload.latitude));
  }
  if (payload.longitude !== undefined) {
    body.append("longitude", String(payload.longitude));
  }
  if (payload.incidentDate !== undefined) {
    body.append("incidentDate", payload.incidentDate);
  }
  if (image) body.append("image", image);

  return body;
}

export function updateAdminIncident(
  incidentId: string,
  payload: UpdateIncidentPayload,
  image?: File,
) {
  return apiClient<ApiResponse<AdminIncident>>(
    `/admin/incidents/${incidentId}`,
    {
      method: "PATCH",
      body: buildIncidentBody(payload, image),
    },
  );
}

export function deleteAdminIncident(incidentId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/admin/incidents/${incidentId}`,
    { method: "DELETE" },
  );
}

export function reviewIncident(
  incidentId: string,
  payload: ReviewIncidentPayload,
) {
  return apiClient<ApiResponse<AdminIncident>>(
    `/admin/incidents/${incidentId}/review`,
    { method: "PATCH", body: payload },
  );
}

export function listIncidentComments(
  incidentId: string,
  query: IncidentCommentListQuery = {},
) {
  return apiClient<ApiResponse<IncidentComment[]>>(
    `/incidents/${incidentId}/comments`,
    { query },
  );
}

export function deleteIncidentComment(incidentId: string, commentId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/admin/incidents/${incidentId}/comments/${commentId}`,
    { method: "DELETE" },
  );
}
