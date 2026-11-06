import type {
  AdminChangeRequestSummary,
  DeletionRequestItem,
} from "./admin.type";
import type { IncidentCategory, IncidentStatus } from "./incident.type";
import type { UserRole } from "./user.type";

export interface DashboardIncidentCard {
  id: string;
  title: string;
  category: IncidentCategory;
  status: IncidentStatus;
  area: string;
  location?: string | null;
  incidentDate: string;
  imageUrl?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  reporter?: { id: string; name: string };
}

export interface IncidentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface UserStats {
  total: number;
  active: number;
  blocked: number;
  pendingDeletion: number;
  deleted: number;
  purged: number;
}

export interface ChangeRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface UserDashboardOverview {
  role: "USER";
  incidents: IncidentStats;
  recentIncidents: DashboardIncidentCard[];
}

export interface AdminDashboardOverview {
  role: "ADMIN";
  users: UserStats;
  incidents: IncidentStats;
  recentPendingIncidents: DashboardIncidentCard[];
  recentDeletionRequests: DeletionRequestItem[];
}

export interface SuperAdminDashboardOverview {
  role: "SUPER_ADMIN";
  users: UserStats & {
    byRole: {
      users: number;
      admins: number;
      superAdmins: number;
    };
  };
  incidents: IncidentStats;
  changeRequests: ChangeRequestStats;
  recentPendingIncidents: DashboardIncidentCard[];
  recentDeletionRequests: DeletionRequestItem[];
  recentChangeRequests: AdminChangeRequestSummary[];
}

export type DashboardOverview =
  | UserDashboardOverview
  | AdminDashboardOverview
  | SuperAdminDashboardOverview;

export type DashboardRole = UserRole;
