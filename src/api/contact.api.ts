import apiClient from "@/lib/apiClient";
import type {
  AdminContactListQuery,
  AdminContactMessage,
  ApiResponse,
  ContactMessagePayload,
  ContactMessageReceipt,
  ReplyContactPayload,
  ReplyContactResult,
} from "@/types";

export function submitContactMessage(payload: ContactMessagePayload) {
  return apiClient<ApiResponse<ContactMessageReceipt>>("/contact", {
    method: "POST",
    body: payload,
  });
}

export function listAdminContactMessages(query: AdminContactListQuery = {}) {
  return apiClient<ApiResponse<AdminContactMessage[]>>("/admin/contacts", {
    query,
  });
}

export function getAdminContactMessage(contactId: string) {
  return apiClient<ApiResponse<AdminContactMessage>>(
    `/admin/contacts/${contactId}`,
  );
}

export function replyToAdminContactMessage(
  contactId: string,
  payload: ReplyContactPayload,
) {
  return apiClient<ApiResponse<ReplyContactResult>>(
    `/admin/contacts/${contactId}/reply`,
    { method: "POST", body: payload },
  );
}
