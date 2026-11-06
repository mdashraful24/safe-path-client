export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "BLOCKED"
  | "PENDING_DELETION"
  | "DELETED"
  | "PURGED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export interface User {
  id: string;
  name: string;
  email: string;
  googleId?: string | null;
  authProvider: AuthProvider;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
