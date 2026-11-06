import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  approveAccountDeletion,
  createAdminChangeRequest,
  deleteAdminIncident,
  deleteIncidentComment,
  getAdminIncident,
  getUserDetails,
  listAdminIncidents,
  listDeletionRequests,
  listUsers,
  rejectAccountDeletion,
  restoreDeletedAccount,
  reviewIncident,
  updateAdminIncident,
  updateUserStatus,
} from "@/api";
import type {
  AdminChangeRequestPayload,
  AdminIncidentQuery,
  AdminReasonPayload,
  AdminUserListQuery,
  DeletionRequestListQuery,
  ReviewIncidentPayload,
  UpdateIncidentPayload,
  UpdateUserStatusPayload,
} from "@/types";

export function useAdminUsers(query: AdminUserListQuery) {
  return useQuery({
    queryKey: ["ADMIN_USERS", query],
    queryFn: () => listUsers(query),
  });
}

export function useAdminUserDetails(userId: string | null) {
  return useQuery({
    queryKey: ["ADMIN_USER", userId],
    queryFn: userId ? () => getUserDetails(userId) : skipToken,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserStatusPayload;
    }) => updateUserStatus(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USERS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USER"] });
      queryClient.invalidateQueries({ queryKey: ["USER"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useDeletionRequests(query: DeletionRequestListQuery) {
  return useQuery({
    queryKey: ["DELETION_REQUESTS", query],
    queryFn: () => listDeletionRequests(query),
  });
}

export function useApproveAccountDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveAccountDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DELETION_REQUESTS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USERS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useRejectAccountDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminReasonPayload;
    }) => rejectAccountDeletion(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DELETION_REQUESTS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USERS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useRestoreDeletedAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AdminReasonPayload;
    }) => restoreDeletedAccount(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USERS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USER"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useCreateAdminChangeRequest() {
  return useMutation({
    mutationFn: (payload: AdminChangeRequestPayload) =>
      createAdminChangeRequest(payload),
  });
}

export function useAdminIncidents(query: AdminIncidentQuery) {
  return useQuery({
    queryKey: ["ADMIN_INCIDENTS", query],
    queryFn: () => listAdminIncidents(query),
  });
}

export function useAdminIncident(incidentId: string | null) {
  return useQuery({
    queryKey: ["ADMIN_INCIDENT", incidentId],
    queryFn: incidentId ? () => getAdminIncident(incidentId) : skipToken,
  });
}

export function useDeleteIncidentComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      commentId,
    }: {
      incidentId: string;
      commentId: string;
    }) => deleteIncidentComment(incidentId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["INCIDENT_COMMENTS", variables.incidentId],
      });
    },
  });
}

export function useUpdateAdminIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      payload,
      image,
    }: {
      incidentId: string;
      payload: UpdateIncidentPayload;
      image?: File;
    }) => updateAdminIncident(incidentId, payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_INCIDENT"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENT"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useDeleteAdminIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminIncident,
    onSuccess: (_, incidentId) => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_INCIDENTS"] });
      queryClient.removeQueries({
        queryKey: ["ADMIN_INCIDENT", incidentId],
      });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENTS"] });
      queryClient.removeQueries({
        queryKey: ["PUBLIC_INCIDENT", incidentId],
      });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useReviewIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      payload,
    }: {
      incidentId: string;
      payload: ReviewIncidentPayload;
    }) => reviewIncident(incidentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_INCIDENT"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENT"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}
