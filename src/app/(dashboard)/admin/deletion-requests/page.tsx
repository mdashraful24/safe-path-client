"use client";

import Image from "next/image";
import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import {
  TableSkeleton,
  UserDetailsSkeleton,
} from "@/components/skeletons/admin-skeletons";
import { Button } from "@/components/ui/button";
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
  useApproveAccountDeletion,
  useDeletionRequests,
  useGetMe,
  useRejectAccountDeletion,
} from "@/hooks";
import { formatDate, formatDateTime, humanize } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type { DeletionRequestItem, UserRole } from "@/types";

const PAGE_SIZE = 10;

const roleOptions: Array<{ value: "" | UserRole; label: string }> = [
  { value: "", label: "All roles" },
  { value: "USER", label: "Users" },
  { value: "ADMIN", label: "Admins" },
  { value: "SUPER_ADMIN", label: "Super admins" },
];

export default function DeletionRequestsPage() {
  const { data: meData } = useGetMe();
  const isSuperAdmin = meData?.data?.role === "SUPER_ADMIN";

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<"" | UserRole>("");
  const [approveTarget, setApproveTarget] =
    useState<DeletionRequestItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<DeletionRequestItem | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");
  const [detailTarget, setDetailTarget] = useState<DeletionRequestItem | null>(
    null,
  );

  const userDetails = useAdminUserDetails(detailTarget?.id ?? null);

  const { data, isPending } = useDeletionRequests({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    role: isSuperAdmin ? role || undefined : undefined,
    sortBy: "deletionRequestedAt",
    sortOrder: "asc",
  });

  const approveDeletion = useApproveAccountDeletion();
  const rejectDeletion = useRejectAccountDeletion();

  const requests = data?.data ?? [];
  const meta = data?.meta;
  const detailUser = userDetails.data?.data;

  const handleApprove = () => {
    if (!approveTarget) return;

    approveDeletion.mutate(approveTarget.id, {
      onSuccess: () => {
        toast.add({
          title: "Deletion approved",
          description: `${approveTarget.name}'s account can be restored during the restore window.`,
          type: "success",
        });
        setApproveTarget(null);
      },
      onError: (error) => {
        toast.add({
          title: "Approval failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  const handleReject = () => {
    if (!rejectTarget) return;

    if (rejectReason.trim().length < 5) {
      toast.add({
        title: "Reason required",
        description: "Please enter at least 5 characters.",
        type: "error",
      });
      return;
    }

    rejectDeletion.mutate(
      {
        userId: rejectTarget.id,
        payload: { reason: rejectReason.trim() },
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Deletion rejected",
            description: `${rejectTarget.name}'s account is active again.`,
            type: "success",
          });
          setRejectTarget(null);
          setRejectReason("");
        },
        onError: (error) => {
          toast.add({
            title: "Rejection failed",
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
        <h1 className="text-xl font-bold tracking-tight">Deletion requests</h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject accounts that requested deletion.
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
        <TableSkeleton
          columns={6}
          rows={PAGE_SIZE}
          label="Loading deletion requests"
        />
      ) : (
        <>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No pending deletion requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.name}
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.role.replace("_", " ")}</TableCell>
                      <TableCell>
                        {formatDate(request.deletionRequestedAt)}
                      </TableCell>
                      <TableCell
                        className="max-w-56 truncate"
                        title={request.deletionRequestReason ?? ""}
                      >
                        {request.deletionRequestReason || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDetailTarget(request)}
                          >
                            Details
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setApproveTarget(request)}
                          >
                            Approve
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setRejectTarget(request)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{meta ? `${meta.total} pending requests` : ""}</span>
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
        open={Boolean(detailTarget)}
        onOpenChange={(open) => {
          if (!open) setDetailTarget(null);
        }}
      >
        <DialogContent className="overflow-hidden rounded-3xl p-0 sm:max-w-2xl">
          <div className="relative overflow-hidden border-b border-slate-800/40 bg-linear-to-br from-slate-950 via-slate-900 to-rose-950 px-6 py-6 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-rose-500/25 blur-3xl"
            />
            <div className="relative flex items-start gap-4">
              {(detailUser?.imageUrl ?? detailTarget?.imageUrl) ? (
                <Image
                  src={
                    (detailUser?.imageUrl ?? detailTarget?.imageUrl) as string
                  }
                  alt={detailUser?.name ?? detailTarget?.name ?? "User"}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-2xl object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white ring-2 ring-white/20">
                  {(detailUser?.name ?? detailTarget?.name ?? "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-lg font-bold text-white">
                  {detailUser?.name ?? detailTarget?.name ?? "Deletion request"}
                </DialogTitle>
                <DialogDescription className="mt-0.5 break-all text-sm text-slate-300">
                  {detailUser?.email ??
                    detailTarget?.email ??
                    "Account deletion request details."}
                </DialogDescription>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200">
                    {humanize(detailUser?.role ?? detailTarget?.role ?? "USER")}
                  </span>
                  {detailUser ? (
                    <StatusBadge value={detailUser.status} />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                      Pending deletion
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {userDetails.isPending ? (
            <UserDetailsSkeleton />
          ) : detailTarget ? (
            <div className="max-h-[55vh] overflow-y-auto px-6 py-6">
              <section className="flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Deletion request
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Requested"
                    value={formatDateTime(
                      detailUser?.deletionRequestedAt ??
                        detailTarget.deletionRequestedAt,
                    )}
                  />
                  <Field
                    label="Current status"
                    value={humanize(detailUser?.status ?? "PENDING_DELETION")}
                  />
                  <Field
                    label="Joined"
                    value={formatDateTime(
                      detailUser?.createdAt ?? detailTarget.createdAt,
                    )}
                  />
                  <Field
                    label="Last login"
                    value={formatDateTime(detailUser?.lastLoginAt)}
                  />
                </div>
                <Field
                  label="Reason from user"
                  value={
                    detailUser?.deletionRequestReason ??
                    detailTarget.deletionRequestReason ??
                    "No reason provided."
                  }
                />
              </section>

              <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

              <section className="flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Account identity
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Email address"
                    value={detailUser?.email ?? detailTarget.email}
                  />
                  <Field
                    label="Role"
                    value={humanize(detailUser?.role ?? detailTarget.role)}
                  />
                  <Field
                    label="Sign-in method"
                    value={
                      detailUser
                        ? detailUser.authProvider === "GOOGLE"
                          ? "Google"
                          : "Email & password"
                        : "—"
                    }
                  />
                  <Field
                    label="Email verification"
                    value={
                      detailUser
                        ? detailUser.emailVerified
                          ? "Verified"
                          : "Not verified"
                        : "—"
                    }
                  />
                  <Field
                    label="User ID"
                    value={detailUser?.id ?? detailTarget.id}
                    mono
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Could not load deletion request details.
              </p>
            </div>
          )}

          {detailTarget && (
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDetailTarget(null)}
              >
                Close
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setDetailTarget(null);
                    setRejectTarget(detailTarget);
                  }}
                >
                  Reject request
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setDetailTarget(null);
                    setApproveTarget(detailTarget);
                  }}
                >
                  Approve deletion
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(approveTarget)}
        onOpenChange={(open) => {
          if (!open) setApproveTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve deletion?</DialogTitle>
            <DialogDescription>
              {approveTarget?.name}&apos;s account will be disabled and
              scheduled for permanent deletion after the restore window.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setApproveTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={approveDeletion.isPending}
              onClick={handleApprove}
            >
              {approveDeletion.isPending ? (
                <>
                  <Spinner />
                  Approving...
                </>
              ) : (
                "Approve deletion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject deletion request</DialogTitle>
            <DialogDescription>
              The account stays active. {rejectTarget?.name} will be notified
              with your reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejecting the request"
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={rejectDeletion.isPending}
              onClick={handleReject}
            >
              {rejectDeletion.isPending ? (
                <>
                  <Spinner />
                  Rejecting...
                </>
              ) : (
                "Reject request"
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
