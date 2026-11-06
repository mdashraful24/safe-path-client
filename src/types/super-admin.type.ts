import type {
  AdminChangeRequestStatus,
  AdminChangeRequestSummary,
  AdminChangeRequestType,
} from "./admin.type";
import type { UserRole } from "./user.type";

export type AdminListSortField =
  | "name"
  | "email"
  | "role"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "lastLoginAt";

export type ChangeRequestSortField =
  | "type"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "reviewedAt";

export interface AdminListQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: "ADMIN" | "SUPER_ADMIN";
  status?: "ACTIVE" | "BLOCKED" | "PENDING_DELETION";
  sortBy?: AdminListSortField;
  sortOrder?: "asc" | "desc";
}

export interface ChangeRequestListQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  type?: AdminChangeRequestType;
  status?: AdminChangeRequestStatus;
  sortBy?: ChangeRequestSortField;
  sortOrder?: "asc" | "desc";
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface AdminRejectPayload {
  reason: string;
}

export interface ApproveChangeRequestResult {
  id: string;
  type: AdminChangeRequestType;
  status: AdminChangeRequestStatus;
  emailVerificationRequired: boolean;
}

export type ChangeRequestItem = AdminChangeRequestSummary;
