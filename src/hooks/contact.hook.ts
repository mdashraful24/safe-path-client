import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAdminContactMessage,
  listAdminContactMessages,
  replyToAdminContactMessage,
  submitContactMessage,
} from "@/api";
import type {
  AdminContactListQuery,
  AdminContactMessage,
  ApiResponse,
  ReplyContactPayload,
} from "@/types";

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: submitContactMessage,
  });
}

export function useAdminContactMessages(query: AdminContactListQuery) {
  return useQuery({
    queryKey: ["ADMIN_CONTACT_MESSAGES", query],
    queryFn: () => listAdminContactMessages(query),
  });
}

export function useAdminContactMessage(contactId: string | null) {
  return useQuery({
    queryKey: ["ADMIN_CONTACT_MESSAGE", contactId],
    queryFn: contactId ? () => getAdminContactMessage(contactId) : skipToken,
  });
}

export function useReplyToAdminContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: string;
      payload: ReplyContactPayload;
    }) => replyToAdminContactMessage(contactId, payload),
    onSuccess: (response, variables) => {
      const updatedMessage = response.data;

      if (updatedMessage) {
        queryClient.setQueriesData<ApiResponse<AdminContactMessage[]>>(
          { queryKey: ["ADMIN_CONTACT_MESSAGES"] },
          (current) => {
            if (!current?.data) return current;

            return {
              ...current,
              data: current.data.map((message) =>
                message.id === updatedMessage.id ? updatedMessage : message,
              ),
            };
          },
        );
        queryClient.setQueryData<ApiResponse<AdminContactMessage>>(
          ["ADMIN_CONTACT_MESSAGE", variables.contactId],
          (current) =>
            current ? { ...current, data: updatedMessage } : current,
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["ADMIN_CONTACT_MESSAGES"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ADMIN_CONTACT_MESSAGE", variables.contactId],
      });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}
