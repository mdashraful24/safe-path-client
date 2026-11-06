export type IncidentCategory =
  | "HARASSMENT"
  | "THEFT"
  | "SUSPICIOUS_ACTIVITY"
  | "UNSAFE_AREA"
  | "OTHER";

export type IncidentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type IncidentSortField =
  | "title"
  | "category"
  | "status"
  | "area"
  | "incidentDate"
  | "createdAt"
  | "updatedAt";

export interface AdminIncidentQuery {
  page?: number;
  limit?: number;
  area?: string;
  category?: IncidentCategory;
  status?: IncidentStatus;
  search?: string;
  searchTerm?: string;
  sortBy?: IncidentSortField;
  sortOrder?: "asc" | "desc";
}

export interface IncidentUserRef {
  id: string;
  name: string;
  email?: string;
}

export interface AdminIncident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  status: IncidentStatus;
  area: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  incidentDate: string;
  imageUrl?: string | null;
  reviewNote?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: IncidentUserRef;
  reviewedBy?: IncidentUserRef | null;
}

export interface IncidentHistoryItem {
  id: string;
  previousStatus?: IncidentStatus | null;
  newStatus: IncidentStatus;
  note?: string | null;
  createdAt: string;
  changedBy: IncidentUserRef;
}

export interface AdminIncidentDetail extends AdminIncident {
  history: IncidentHistoryItem[];
}

export interface IncidentComment {
  id: string;
  content: string;
  incidentId: string;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

export interface IncidentCommentListQuery {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface UpdateIncidentPayload {
  title?: string;
  description?: string;
  category?: IncidentCategory;
  area?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  incidentDate?: string;
}

export interface ReviewIncidentPayload {
  status: "APPROVED" | "REJECTED";
  note?: string;
}
