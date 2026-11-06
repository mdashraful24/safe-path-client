import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  IncidentComment,
  IncidentCommentListQuery,
} from "@/types";

export function listComments(
  incidentId: string,
  query: IncidentCommentListQuery = {},
) {
  return apiClient<ApiResponse<IncidentComment[]>>(
    `/incidents/${incidentId}/comments`,
    { query },
  );
}

export function createComment(incidentId: string, content: string) {
  return apiClient<ApiResponse<IncidentComment>>(
    `/incidents/${incidentId}/comments`,
    { method: "POST", body: { content } },
  );
}

export function updateComment(
  incidentId: string,
  commentId: string,
  content: string,
) {
  return apiClient<ApiResponse<IncidentComment>>(
    `/incidents/${incidentId}/comments/${commentId}`,
    { method: "PATCH", body: { content } },
  );
}

export function deleteComment(incidentId: string, commentId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/incidents/${incidentId}/comments/${commentId}`,
    { method: "DELETE" },
  );
}
