"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import {
  TableSkeleton,
  UserDetailsSkeleton,
} from "@/components/skeletons/admin-skeletons";
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
import { formatDate, formatDateTime, humanize } from "@/lib/format";
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
  const detailUser = userDetails.data?.data;
  const hasDeletionInfo = Boolean(
    detailUser?.deletionRequestedAt ||
      detailUser?.deletionRequestReason ||
      detailUser?.deletionApprovedAt ||
      detailUser?.deletedAt ||
      detailUser?.restoreDeadline ||
      detailUser?.restoredAt ||
      detailUser?.purgeAfter ||
      detailUser?.deletionRejectedAt ||
      detailUser?.deletionRejectionReason,
  );

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
        <TableSkeleton columns={6} rows={PAGE_SIZE} label="Loading users" />
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
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            Details
                          </Button>
                          {(user.status === "ACTIVE" ||
                            user.status === "BLOCKED") && (
                            <Button
                              type="button"
                              variant="destructive"
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
        <DialogContent className="overflow-hidden rounded-3xl p-0 sm:max-w-2xl">
          <div className="relative overflow-hidden border-b border-slate-800/40 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-6 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-emerald-500/25 blur-3xl"
            />
            <div className="relative flex items-start gap-4">
              {detailUser?.imageUrl ? (
                <Image
                  src={detailUser.imageUrl}
                  alt={detailUser.name}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-2xl object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white ring-2 ring-white/20">
                  {detailUser?.name.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-lg font-bold text-white">
                  {detailUser?.name ?? "User details"}
                </DialogTitle>
                <DialogDescription className="mt-0.5 break-all text-sm text-slate-300">
                  {detailUser?.email ??
                    "Account lifecycle and activity information."}
                </DialogDescription>
                {detailUser && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                      {humanize(detailUser.role)}
                    </span>
                    <StatusBadge value={detailUser.status} />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                      {detailUser.authProvider === "GOOGLE"
                        ? "Google"
                        : "Email & password"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {userDetails.isPending ? (
            <UserDetailsSkeleton />
          ) : detailUser ? (
            <div className="max-h-[55vh] overflow-y-auto px-6 py-6">
              <section className="flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Account identity
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Full name" value={detailUser.name} />
                  <Field label="Email address" value={detailUser.email} />
                  <Field label="Role" value={humanize(detailUser.role)} />
                  <Field
                    label="Sign-in method"
                    value={
                      detailUser.authProvider === "GOOGLE"
                        ? "Google"
                        : "Email & password"
                    }
                  />
                  <Field
                    label="Email verification"
                    value={
                      detailUser.emailVerified ? "Verified" : "Not verified"
                    }
                  />
                  <Field label="User ID" value={detailUser.id} mono />
                </div>
              </section>

              <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

              <section className="flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Account activity
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Joined"
                    value={formatDateTime(detailUser.createdAt)}
                  />
                  <Field
                    label="Last login"
                    value={formatDateTime(detailUser.lastLoginAt)}
                  />
                </div>
              </section>

              {hasDeletionInfo && (
                <>
                  <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />
                  <section className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Deletion & recovery
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {detailUser.deletionRequestedAt && (
                        <Field
                          label="Requested"
                          value={formatDateTime(detailUser.deletionRequestedAt)}
                        />
                      )}
                      {detailUser.deletionApprovedAt && (
                        <Field
                          label="Approved"
                          value={formatDateTime(detailUser.deletionApprovedAt)}
                        />
                      )}
                      {detailUser.deletedAt && (
                        <Field
                          label="Deleted"
                          value={formatDateTime(detailUser.deletedAt)}
                        />
                      )}
                      {detailUser.restoreDeadline && (
                        <Field
                          label="Restore deadline"
                          value={formatDateTime(detailUser.restoreDeadline)}
                        />
                      )}
                      {detailUser.restoredAt && (
                        <Field
                          label="Restored"
                          value={formatDateTime(detailUser.restoredAt)}
                        />
                      )}
                      {detailUser.purgeAfter && (
                        <Field
                          label="Purge after"
                          value={formatDateTime(detailUser.purgeAfter)}
                        />
                      )}
                      {detailUser.deletionRejectedAt && (
                        <Field
                          label="Rejected"
                          value={formatDateTime(detailUser.deletionRejectedAt)}
                        />
                      )}
                      {detailUser.deletionRejectionReason && (
                        <Field
                          label="Rejection reason"
                          value={detailUser.deletionRejectionReason}
                        />
                      )}
                    </div>
                    {detailUser.deletionRequestReason && (
                      <Field
                        label="Deletion reason"
                        value={detailUser.deletionRequestReason}
                      />
                    )}
                  </section>
                </>
              )}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Could not load user details.
              </p>
            </div>
          )}

          {detailUser && (
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedUserId(null)}
              >
                Close
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row">
                {(detailUser.status === "ACTIVE" ||
                  detailUser.status === "BLOCKED") && (
                  <Button
                    type="button"
                    variant={
                      detailUser.status === "ACTIVE" ? "destructive" : "default"
                    }
                    onClick={() => {
                      setSelectedUserId(null);
                      setStatusTarget(detailUser);
                    }}
                  >
                    {detailUser.status === "ACTIVE"
                      ? "Block user"
                      : "Unblock user"}
                  </Button>
                )}
                {detailUser.status === "DELETED" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedUserId(null);
                      setRestoreTarget(detailUser);
                    }}
                  >
                    Restore account
                  </Button>
                )}
                {detailUser.status === "PENDING_DELETION" && (
                  <Link
                    href="/admin/deletion-requests"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Review request
                  </Link>
                )}
              </div>
            </div>
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

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/30">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={
          mono
            ? "break-all font-mono text-xs font-medium text-slate-700 dark:text-slate-300"
            : "break-words text-sm font-medium text-slate-900 dark:text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}
