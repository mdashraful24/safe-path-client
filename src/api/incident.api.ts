import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateIncidentPayload,
  Incident,
  IncidentListQuery,
  MyIncident,
  UpdateIncidentPayload,
} from "@/types";

function buildIncidentBody(
  payload: Partial<CreateIncidentPayload>,
  image?: File,
) {
  const body = new FormData();

  if (payload.title !== undefined) body.append("title", payload.title);
  if (payload.description !== undefined) {
    body.append("description", payload.description);
  }
  if (payload.category !== undefined) {
    body.append("category", payload.category);
  }
  if (payload.area !== undefined) body.append("area", payload.area);
  if (payload.location !== undefined) body.append("location", payload.location);
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

export function listPublicIncidents(query: IncidentListQuery = {}) {
  return apiClient<ApiResponse<Incident[]>>("/incidents", { query });
}

export function getPublicIncident(incidentId: string) {
  return apiClient<ApiResponse<Incident>>(`/incidents/${incidentId}`);
}

export function listMyIncidents(query: IncidentListQuery = {}) {
  return apiClient<ApiResponse<MyIncident[]>>("/incidents/my-incidents", {
    query,
  });
}

export function getMyIncident(incidentId: string) {
  return apiClient<ApiResponse<MyIncident>>(
    `/incidents/my-incidents/${incidentId}`,
  );
}

export function createIncident(payload: CreateIncidentPayload, image?: File) {
  return apiClient<ApiResponse<MyIncident>>("/incidents", {
    method: "POST",
    body: buildIncidentBody(payload, image),
  });
}

export function updateMyIncident(
  incidentId: string,
  payload: UpdateIncidentPayload,
  image?: File,
) {
  return apiClient<ApiResponse<MyIncident>>(
    `/incidents/my-incidents/${incidentId}`,
    { method: "PATCH", body: buildIncidentBody(payload, image) },
  );
}

export function deleteMyIncident(incidentId: string) {
  return apiClient<ApiResponse<null>>(`/incidents/my-incidents/${incidentId}`, {
    method: "DELETE",
  });
}
