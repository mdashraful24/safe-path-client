import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createIncident,
  deleteMyIncident,
  getMyIncident,
  getPublicIncident,
  listMyIncidents,
  listPublicIncidents,
  updateMyIncident,
} from "@/api";
import type {
  CreateIncidentPayload,
  IncidentListQuery,
  UpdateIncidentPayload,
} from "@/types";

export function usePublicIncidents(query: IncidentListQuery) {
  return useQuery({
    queryKey: ["PUBLIC_INCIDENTS", query],
    queryFn: () => listPublicIncidents(query),
  });
}

export function usePublicIncident(incidentId: string | null) {
  return useQuery({
    queryKey: ["PUBLIC_INCIDENT", incidentId],
    queryFn: incidentId ? () => getPublicIncident(incidentId) : skipToken,
  });
}

export function useMyIncidents(query: IncidentListQuery) {
  return useQuery({
    queryKey: ["MY_INCIDENTS", query],
    queryFn: () => listMyIncidents(query),
  });
}

export function useMyIncident(incidentId: string | null) {
  return useQuery({
    queryKey: ["MY_INCIDENT", incidentId],
    queryFn: incidentId ? () => getMyIncident(incidentId) : skipToken,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      image,
    }: {
      payload: CreateIncidentPayload;
      image?: File;
    }) => createIncident(payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MY_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useUpdateMyIncident() {
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
    }) => updateMyIncident(incidentId, payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MY_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["MY_INCIDENT"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENT"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useDeleteMyIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MY_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_INCIDENTS"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}
