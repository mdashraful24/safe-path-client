import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveChangeRequest,
  listAdmins,
  listChangeRequests,
  rejectChangeRequest,
  updateUserRole,
} from "@/api";
import type {
  AdminListQuery,
  AdminRejectPayload,
  ChangeRequestListQuery,
  UpdateUserRolePayload,
} from "@/types";

export function useAdmins(query: AdminListQuery) {
  return useQuery({
    queryKey: ["ADMINS", query],
    queryFn: () => listAdmins(query),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserRolePayload;
    }) => updateUserRole(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMINS"] });
      queryClient.invalidateQueries({ queryKey: ["ADMIN_USERS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useChangeRequests(query: ChangeRequestListQuery) {
  return useQuery({
    queryKey: ["CHANGE_REQUESTS", query],
    queryFn: () => listChangeRequests(query),
  });
}

export function useApproveChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveChangeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CHANGE_REQUESTS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useRejectChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: AdminRejectPayload;
    }) => rejectChangeRequest(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CHANGE_REQUESTS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}
