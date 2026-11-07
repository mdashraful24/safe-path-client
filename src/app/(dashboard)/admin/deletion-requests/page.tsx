"use client";

import { useState } from "react";
import { TableSkeleton } from "@/components/skeletons/admin-skeletons";
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
  useApproveAccountDeletion,
  useDeletionRequests,
  useGetMe,
  useRejectAccountDeletion,
} from "@/hooks";
import { formatDate } from "@/lib/format";
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
