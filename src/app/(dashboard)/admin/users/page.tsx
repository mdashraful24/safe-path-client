"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import NativeSelect from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useAdminUserDetails,
  useAdminUsers,
  useGetMe,
  useRestoreDeletedAccount,
  useUpdateUserStatus,
} from "@/hooks";
import { formatDate, formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type { User, UserRole, UserStatus } from "@/types";

const PAGE_SIZE = 10;

const statusOptions: Array<{ value: "" | UserStatus; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "PENDING_DELETION", label: "Pending deletion" },
  { value: "DELETED", label: "Deleted" },
  { value: "PURGED", label: "Purged" },
];

const roleOptions: Array<{ value: "" | UserRole; label: string }> = [
  { value: "", label: "All roles" },
  { value: "USER", label: "Users" },
  { value: "ADMIN", label: "Admins" },
  { value: "SUPER_ADMIN", label: "Super admins" },
];

export default function AdminUsersPage() {
  const { data: meData } = useGetMe();
  const isSuperAdmin = meData?.data?.role === "SUPER_ADMIN";

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"" | UserStatus>("");
  const [role, setRole] = useState<"" | UserRole>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<User | null>(null);
  const [restoreReason, setRestoreReason] = useState("");

  const { data, isPending } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    status: status || undefined,
    role: isSuperAdmin ? role || undefined : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const userDetails = useAdminUserDetails(selectedUserId);
  const updateStatus = useUpdateUserStatus();
  const restoreAccount = useRestoreDeletedAccount();

  const users = data?.data ?? [];
  const meta = data?.meta;

  const handleStatusChange = () => {
    if (!statusTarget) return;

    const nextStatus = statusTarget.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    updateStatus.mutate(
      { userId: statusTarget.id, payload: { status: nextStatus } },
      {
        onSuccess: () => {
          toast.add({
            title: "User updated",
            description:
              nextStatus === "BLOCKED"
                ? "The user has been blocked."
                : "The user has been unblocked.",
            type: "success",
          });
          setStatusTarget(null);
        },
        onError: (error) => {
          toast.add({
            title: "Update failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleRestore = () => {
    if (!restoreTarget) return;

    if (restoreReason.trim().length < 5) {
      toast.add({
        title: "Reason required",
        description: "Please enter at least 5 characters.",
        type: "error",
      });
      return;
    }

    restoreAccount.mutate(
      {
        userId: restoreTarget.id,
        payload: { reason: restoreReason.trim() },
      },
      {
        onSuccess: (response) => {
          toast.add({
            title: "Account restored",
            description: response.message,
            type: "success",
          });
          setRestoreTarget(null);
          setRestoreReason("");
        },
        onError: (error) => {
          toast.add({
            title: "Restore failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Search accounts, review details, and manage access.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name or email"
          value={searchTerm}
          className="w-full sm:w-64"
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
        />
        <NativeSelect
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | UserStatus);
            setPage(1);
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
        {isSuperAdmin && (
          <NativeSelect
            aria-label="Filter by role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value as "" | UserRole);
              setPage(1);
            }}
          >
            {roleOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        )}
      </div>

      {isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role.replace("_", " ")}</TableCell>
                      <TableCell>
                        <StatusBadge value={user.status} />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            Details
                          </Button>
                          {(user.status === "ACTIVE" ||
                            user.status === "BLOCKED") && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setStatusTarget(user)}
                            >
                              {user.status === "ACTIVE" ? "Block" : "Unblock"}
                            </Button>
                          )}
                          {user.status === "DELETED" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRestoreTarget(user)}
                            >
                              Restore
                            </Button>
                          )}
                          {user.status === "PENDING_DELETION" && (
                            <Link
                              href="/admin/deletion-requests"
                              className={buttonVariants({
                                variant: "outline",
                                size: "sm",
                              })}
                            >
                              Review request
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{meta ? `${meta.total} total users` : ""}</span>
            {meta && (
              <TablePagination
                page={page}
                totalPages={meta.totalPages}
                handlePageChange={setPage}
              />
            )}
          </div>
        </>
      )}

      <Dialog
        open={Boolean(selectedUserId)}
        onOpenChange={(open) => {
          if (!open) setSelectedUserId(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User details</DialogTitle>
            <DialogDescription>
              Account lifecycle and activity information.
            </DialogDescription>
          </DialogHeader>

          {userDetails.isPending ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : userDetails.data?.data ? (
            <div className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={userDetails.data.data.name} />
                <Field label="Email" value={userDetails.data.data.email} />
                <Field
                  label="Role"
                  value={userDetails.data.data.role.replace("_", " ")}
                />
                <Field
                  label="Status"
                  value={userDetails.data.data.status.replace("_", " ")}
                />
                <Field
                  label="Email verified"
                  value={userDetails.data.data.emailVerified ? "Yes" : "No"}
                />
                <Field
                  label="Sign-in method"
                  value={userDetails.data.data.authProvider}
                />
                <Field
                  label="Joined"
                  value={formatDateTime(userDetails.data.data.createdAt)}
                />
                <Field
                  label="Last login"
                  value={formatDateTime(userDetails.data.data.lastLoginAt)}
                />
                <Field
                  label="Deletion requested"
                  value={formatDateTime(
                    userDetails.data.data.deletionRequestedAt,
                  )}
                />
                <Field
                  label="Restore deadline"
                  value={formatDateTime(userDetails.data.data.restoreDeadline)}
                />
              </div>
              {userDetails.data.data.deletionRequestReason && (
                <Field
                  label="Deletion reason"
                  value={userDetails.data.data.deletionRequestReason}
                />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Could not load user details.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusTarget?.status === "ACTIVE" ? "Block" : "Unblock"} user?
            </DialogTitle>
            <DialogDescription>
              {statusTarget?.status === "ACTIVE"
                ? "The user will be signed out and unable to log in."
                : "The user will be able to log in again."}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm font-medium">{statusTarget?.name}</p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStatusTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={
                statusTarget?.status === "ACTIVE" ? "destructive" : "default"
              }
              disabled={updateStatus.isPending}
              onClick={handleStatusChange}
            >
              {updateStatus.isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : statusTarget?.status === "ACTIVE" ? (
                "Block user"
              ) : (
                "Unblock user"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setRestoreTarget(null);
            setRestoreReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore account</DialogTitle>
            <DialogDescription>
              Restore {restoreTarget?.name} only if the restore deadline has not
              passed.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for restoring the account"
            value={restoreReason}
            onChange={(event) => setRestoreReason(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRestoreTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={restoreAccount.isPending}
              onClick={handleRestore}
            >
              {restoreAccount.isPending ? (
                <>
                  <Spinner />
                  Restoring...
                </>
              ) : (
                "Restore account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
