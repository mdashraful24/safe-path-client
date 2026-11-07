"use client";

import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import { TableSkeleton } from "@/components/skeletons/admin-skeletons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  useAdmins,
  useApproveChangeRequest,
  useChangeRequests,
  useRejectChangeRequest,
  useUpdateUserRole,
} from "@/hooks";
import { formatDate, formatDateTime, humanize } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type {
  AdminChangeRequestStatus,
  AdminChangeRequestSummary,
  AdminChangeRequestType,
  User,
  UserRole,
} from "@/types";

const PAGE_SIZE = 10;

const roleOptions: UserRole[] = ["USER", "ADMIN", "SUPER_ADMIN"];

const typeOptions: Array<{
  value: "" | AdminChangeRequestType;
  label: string;
}> = [
  { value: "", label: "All types" },
  { value: "EMAIL", label: "Email" },
  { value: "PASSWORD", label: "Password" },
];

const requestStatusOptions: Array<{
  value: "" | AdminChangeRequestStatus;
  label: string;
}> = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function SuperAdminPage() {
  const [adminPage, setAdminPage] = useState(1);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminRole, setAdminRole] = useState<"" | "ADMIN" | "SUPER_ADMIN">("");
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("ADMIN");

  const [requestPage, setRequestPage] = useState(1);
  const [requestSearch, setRequestSearch] = useState("");
  const [requestType, setRequestType] = useState<"" | AdminChangeRequestType>(
    "",
  );
  const [requestStatus, setRequestStatus] = useState<
    "" | AdminChangeRequestStatus
  >("PENDING");
  const [approveTarget, setApproveTarget] =
    useState<AdminChangeRequestSummary | null>(null);
  const [rejectTarget, setRejectTarget] =
    useState<AdminChangeRequestSummary | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const admins = useAdmins({
    page: adminPage,
    limit: PAGE_SIZE,
    searchTerm: adminSearch || undefined,
    role: adminRole || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const requests = useChangeRequests({
    page: requestPage,
    limit: PAGE_SIZE,
    searchTerm: requestSearch || undefined,
    type: requestType || undefined,
    status: requestStatus || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const updateRole = useUpdateUserRole();
  const approveRequest = useApproveChangeRequest();
  const rejectRequest = useRejectChangeRequest();

  const adminList = admins.data?.data ?? [];
  const adminMeta = admins.data?.meta;
  const requestList = requests.data?.data ?? [];
  const requestMeta = requests.data?.meta;

  const openRoleDialog = (user: User) => {
    setRoleTarget(user);
    setNewRole(user.role);
  };

  const handleRoleUpdate = () => {
    if (!roleTarget) return;

    updateRole.mutate(
      { userId: roleTarget.id, payload: { role: newRole } },
      {
        onSuccess: () => {
          toast.add({
            title: "Role updated",
            description: `${roleTarget.name} is now ${humanize(newRole)}.`,
            type: "success",
          });
          setRoleTarget(null);
        },
        onError: (error) => {
          toast.add({
            title: "Role update failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleApprove = () => {
    if (!approveTarget) return;

    approveRequest.mutate(approveTarget.id, {
      onSuccess: (response) => {
        toast.add({
          title: "Change approved",
          description: response.data?.emailVerificationRequired
            ? "The admin must verify the new email before it becomes active."
            : "The requested change was applied.",
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

    rejectRequest.mutate(
      {
        requestId: rejectTarget.id,
        payload: { reason: rejectReason.trim() },
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Change rejected",
            description: "The admin has been notified.",
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Super admin</h1>
        <p className="text-sm text-muted-foreground">
          Manage admin roles and review credential change requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>
            Promote or demote staff accounts. At least one super admin must
            remain.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search name or email"
              value={adminSearch}
              className="w-full sm:w-64"
              onChange={(event) => {
                setAdminSearch(event.target.value);
                setAdminPage(1);
              }}
            />
            <NativeSelect
              aria-label="Filter by role"
              value={adminRole}
              onChange={(event) => {
                setAdminRole(
                  event.target.value as "" | "ADMIN" | "SUPER_ADMIN",
                );
                setAdminPage(1);
              }}
            >
              <option value="">All staff roles</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super admins</option>
            </NativeSelect>
          </div>

          {admins.isPending ? (
            <TableSkeleton
              columns={6}
              rows={PAGE_SIZE}
              label="Loading staff accounts"
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
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminList.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No staff accounts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      adminList.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">
                            {admin.name}
                          </TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{humanize(admin.role)}</TableCell>
                          <TableCell>
                            <StatusBadge value={admin.status} />
                          </TableCell>
                          <TableCell>{formatDate(admin.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openRoleDialog(admin)}
                              >
                                Change role
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
                <span>{adminMeta ? `${adminMeta.total} staff` : ""}</span>
                {adminMeta && (
                  <TablePagination
                    page={adminPage}
                    totalPages={adminMeta.totalPages}
                    handlePageChange={setAdminPage}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change requests</CardTitle>
          <CardDescription>
            Approve or reject email and password changes submitted by admins.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search requester"
              value={requestSearch}
              className="w-full sm:w-64"
              onChange={(event) => {
                setRequestSearch(event.target.value);
                setRequestPage(1);
              }}
            />
            <NativeSelect
              aria-label="Filter by request type"
              value={requestType}
              onChange={(event) => {
                setRequestType(
                  event.target.value as "" | AdminChangeRequestType,
                );
                setRequestPage(1);
              }}
            >
              {typeOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              aria-label="Filter by request status"
              value={requestStatus}
              onChange={(event) => {
                setRequestStatus(
                  event.target.value as "" | AdminChangeRequestStatus,
                );
                setRequestPage(1);
              }}
            >
              {requestStatusOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </div>

          {requests.isPending ? (
            <TableSkeleton
              columns={7}
              rows={PAGE_SIZE}
              label="Loading change requests"
            />
          ) : (
            <>
              <div className="rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requested change</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestList.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No change requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      requestList.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.requester.name}
                          </TableCell>
                          <TableCell>{humanize(request.type)}</TableCell>
                          <TableCell>
                            {request.type === "EMAIL"
                              ? request.requestedEmail || "—"
                              : "New password"}
                          </TableCell>
                          <TableCell className="max-w-56 whitespace-normal">
                            {request.reason}
                          </TableCell>
                          <TableCell>
                            <StatusBadge value={request.status} />
                          </TableCell>
                          <TableCell>
                            {formatDateTime(request.createdAt)}
                          </TableCell>
                          <TableCell>
                            {request.status === "PENDING" ? (
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
                            ) : (
                              <span className="block text-right text-xs text-muted-foreground">
                                Resolved
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>
                  {requestMeta ? `${requestMeta.total} requests` : ""}
                </span>
                {requestMeta && (
                  <TablePagination
                    page={requestPage}
                    totalPages={requestMeta.totalPages}
                    handlePageChange={setRequestPage}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(roleTarget)}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              Update the role for {roleTarget?.name}.
            </DialogDescription>
          </DialogHeader>
          <NativeSelect
            aria-label="New role"
            value={newRole}
            onChange={(event) => setNewRole(event.target.value as UserRole)}
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {humanize(option)}
              </option>
            ))}
          </NativeSelect>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRoleTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={updateRole.isPending}
              onClick={handleRoleUpdate}
            >
              {updateRole.isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Update role"
              )}
            </Button>
          </DialogFooter>
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
            <DialogTitle>Approve change request?</DialogTitle>
            <DialogDescription>
              {approveTarget?.type === "EMAIL"
                ? `The admin will need to verify ${approveTarget?.requestedEmail} before the change takes effect.`
                : "The admin's password will be changed immediately."}
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
              disabled={approveRequest.isPending}
              onClick={handleApprove}
            >
              {approveRequest.isPending ? (
                <>
                  <Spinner />
                  Approving...
                </>
              ) : (
                "Approve request"
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
            <DialogTitle>Reject change request</DialogTitle>
            <DialogDescription>
              The admin will receive your reason by email.
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
              variant="destructive"
              disabled={rejectRequest.isPending}
              onClick={handleReject}
            >
              {rejectRequest.isPending ? (
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
