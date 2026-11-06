import type { UserRole, UserStatus } from "./user.type";

export type AdminUserSortField =
  | "name"
  | "email"
  | "role"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "lastLoginAt";

export type DeletionRequestSortField =
  | "name"
  | "email"
  | "role"
  | "deletionRequestedAt"
  | "createdAt";

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: AdminUserSortField;
  sortOrder?: "asc" | "desc";
}

export interface DeletionRequestListQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: UserRole;
  sortBy?: DeletionRequestSortField;
  sortOrder?: "asc" | "desc";
}

export interface DeletionRequestItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl?: string | null;
  deletionRequestedAt?: string | null;
  deletionRequestReason?: string | null;
  createdAt: string;
}

export interface UpdateUserStatusPayload {
  status: "ACTIVE" | "BLOCKED";
}

export interface AdminReasonPayload {
  reason: string;
}

export interface AdminChangeRequestEmailPayload {
  type: "EMAIL";
  reason: string;
  requestedEmail: string;
}

export interface AdminChangeRequestPasswordPayload {
  type: "PASSWORD";
  reason: string;
  newPassword: string;
}

export type AdminChangeRequestPayload =
  | AdminChangeRequestEmailPayload
  | AdminChangeRequestPasswordPayload;

export type AdminChangeRequestType = "EMAIL" | "PASSWORD";
export type AdminChangeRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminChangeRequestSummary {
  id: string;
  type: AdminChangeRequestType;
  reason: string;
  requestedEmail?: string | null;
  status: AdminChangeRequestStatus;
  createdAt: string;
  requester: { id: string; name: string; email: string };
  targetUser: { id: string; name: string; email: string; role: UserRole };
}

export interface AdminChangeRequestCreated {
  id: string;
  type: AdminChangeRequestType;
  targetUserId: string;
  status: AdminChangeRequestStatus;
  createdAt: string;
}
