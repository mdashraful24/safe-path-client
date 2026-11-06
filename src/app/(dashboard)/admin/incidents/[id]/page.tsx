"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import TablePagination from "@/components/ui/table-pagination";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useAdminIncident,
  useDeleteAdminIncident,
  useDeleteIncidentComment,
  useIncidentComments,
  useReviewIncident,
  useUpdateAdminIncident,
} from "@/hooks";
import { formatDate, formatDateTime, humanize } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type {
  AdminIncident,
  AdminIncidentDetail,
  IncidentCategory,
  IncidentComment,
  IncidentHistoryItem,
  UpdateIncidentPayload,
} from "@/types";
import { reviewIncidentSchema, updateIncidentSchema } from "@/validation";

const categories: IncidentCategory[] = [
  "HARASSMENT",
  "THEFT",
  "SUSPICIOUS_ACTIVITY",
  "UNSAFE_AREA",
  "OTHER",
];

export default function AdminIncidentDetailPage() {
  const params = useParams();
  const incidentId = typeof params.id === "string" ? params.id : null;
  const { data, isPending, isError } = useAdminIncident(incidentId);
  const incident = data?.data;

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !incident) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          Incident not found or could not be loaded.
        </p>
        <Link
          href="/admin/incidents"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to incidents
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/incidents"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to incidents
          </Link>
          <h1 className="mt-1 text-xl font-bold tracking-tight">
            {incident.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Reported by {incident.reporter.name} on{" "}
            {formatDate(incident.incidentDate)}
          </p>
        </div>
        <StatusBadge value={incident.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Report details</CardTitle>
              <CardDescription>{humanize(incident.category)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="whitespace-pre-wrap text-sm">
                {incident.description}
              </p>
              {incident.imageUrl && (
                <Image
                  src={incident.imageUrl}
                  alt={incident.title}
                  width={800}
                  height={320}
                  className="max-h-80 w-full rounded-lg object-cover"
                />
              )}
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Info label="Area" value={incident.area} />
                <Info
                  label="Location"
                  value={incident.location || "Not specified"}
                />
                <Info
                  label="Coordinates"
                  value={
                    incident.latitude != null && incident.longitude != null
                      ? `${incident.latitude}, ${incident.longitude}`
                      : "Not specified"
                  }
                />
                <Info
                  label="Reporter email"
                  value={incident.reporter.email || "Not available"}
                />
              </div>
            </CardContent>
          </Card>

          {incident.status === "PENDING" && <ReviewCard incident={incident} />}

          <EditIncidentCard incident={incident} />

          {incident.status === "APPROVED" && (
            <CommentsCard incident={incident} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <Info
                label="Reviewed by"
                value={incident.reviewedBy?.name || "Not reviewed"}
              />
              <Info
                label="Reviewed at"
                value={formatDateTime(incident.reviewedAt)}
              />
              <Info
                label="Review note"
                value={incident.reviewNote || "No note"}
              />
              <Info
                label="Last updated"
                value={formatDateTime(incident.updatedAt)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {incident.history.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No history entries yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {incident.history.map((entry) => (
                    <HistoryEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <DeleteIncidentCard incident={incident} />
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ incident }: { incident: AdminIncidentDetail }) {
  const [note, setNote] = useState("");
  const reviewIncident = useReviewIncident();

  const handleReview = (status: "APPROVED" | "REJECTED") => {
    const result = reviewIncidentSchema.safeParse({
      status,
      note: note.trim() || undefined,
    });

    if (!result.success) {
      toast.add({
        title: "Check your note",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    reviewIncident.mutate(
      { incidentId: incident.id, payload: result.data },
      {
        onSuccess: () => {
          setNote("");
          toast.add({
            title:
              status === "APPROVED" ? "Incident approved" : "Incident rejected",
            description:
              status === "APPROVED"
                ? "The incident is now publicly visible."
                : "The reporter will see your review note.",
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Review failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review incident</CardTitle>
        <CardDescription>
          Approve to publish the report, or reject it with a note.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Textarea
          placeholder="Review note (required to reject)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={reviewIncident.isPending}
            onClick={() => handleReview("APPROVED")}
          >
            {reviewIncident.isPending ? <Spinner /> : null}
            Approve
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={reviewIncident.isPending}
            onClick={() => handleReview("REJECTED")}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EditIncidentCard({ incident }: { incident: AdminIncidentDetail }) {
  const [title, setTitle] = useState(incident.title);
  const [description, setDescription] = useState(incident.description);
  const [category, setCategory] = useState<IncidentCategory>(incident.category);
  const [area, setArea] = useState(incident.area);
  const [location, setLocation] = useState(incident.location ?? "");
  const [incidentDate, setIncidentDate] = useState(
    incident.incidentDate.slice(0, 10),
  );
  const [image, setImage] = useState<File | undefined>();

  const updateIncident = useUpdateAdminIncident();

  const handleUpdate = () => {
    const payload: UpdateIncidentPayload = {
      title,
      description,
      category,
      area,
      location: location.trim() || undefined,
      incidentDate,
    };

    const result = updateIncidentSchema.safeParse(payload);

    if (!result.success) {
      toast.add({
        title: "Check your input",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    updateIncident.mutate(
      { incidentId: incident.id, payload: result.data, image },
      {
        onSuccess: () => {
          setImage(undefined);
          toast.add({
            title: "Incident updated",
            description: "The report details were saved.",
            type: "success",
          });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit details</CardTitle>
        <CardDescription>
          Corrections are recorded in the incident history.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          value={title}
          placeholder="Title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <Textarea
          value={description}
          placeholder="Description"
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <NativeSelect
            aria-label="Category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as IncidentCategory)
            }
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {humanize(option)}
              </option>
            ))}
          </NativeSelect>
          <Input
            value={area}
            placeholder="Area"
            onChange={(event) => setArea(event.target.value)}
          />
          <Input
            value={location}
            placeholder="Location"
            onChange={(event) => setLocation(event.target.value)}
          />
          <Input
            type="date"
            value={incidentDate}
            onChange={(event) => setIncidentDate(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="incident-image">
            Replace image
          </label>
          <Input
            id="incident-image"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0])}
          />
        </div>
        <div>
          <Button
            type="button"
            disabled={updateIncident.isPending}
            onClick={handleUpdate}
          >
            {updateIncident.isPending ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentsCard({ incident }: { incident: AdminIncidentDetail }) {
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<IncidentComment | null>(null);

  const { data, isPending } = useIncidentComments(incident.id, {
    page,
    limit: 10,
    sortOrder: "desc",
  });
  const deleteComment = useDeleteIncidentComment();

  const comments = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = () => {
    if (!target) return;

    deleteComment.mutate(
      { incidentId: incident.id, commentId: target.id },
      {
        onSuccess: () => {
          toast.add({
            title: "Comment deleted",
            description: "The comment was removed.",
            type: "success",
          });
          setTarget(null);
        },
        onError: (error) => {
          toast.add({
            title: "Delete failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>
          Moderate comments on this approved incident.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isPending ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          <div className="flex flex-col divide-y">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-1 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(comment.createdAt)}
                      {comment.editedAt ? " · edited" : ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setTarget(comment)}
                  >
                    Delete
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <TablePagination
            page={page}
            totalPages={meta.totalPages}
            handlePageChange={setPage}
          />
        )}
      </CardContent>

      <Dialog
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete comment?</DialogTitle>
            <DialogDescription>
              This removes the comment from the public incident page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteComment.isPending}
              onClick={handleDelete}
            >
              {deleteComment.isPending ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete comment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DeleteIncidentCard({ incident }: { incident: AdminIncident }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteIncident = useDeleteAdminIncident();

  const handleDelete = () => {
    deleteIncident.mutate(incident.id, {
      onSuccess: () => {
        toast.add({
          title: "Incident deleted",
          description: "The report and its history were removed.",
          type: "success",
        });
        router.push("/admin/incidents");
      },
      onError: (error) => {
        toast.add({
          title: "Delete failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete incident</CardTitle>
        <CardDescription>
          Permanently remove this report, its comments, and history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setOpen(true)}
        >
          Delete incident
        </Button>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this incident?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The image will also be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteIncident.isPending}
              onClick={handleDelete}
            >
              {deleteIncident.isPending ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function HistoryEntry({ entry }: { entry: IncidentHistoryItem }) {
  return (
    <div className="border-l-2 pl-3 text-sm">
      <p className="font-medium">
        {entry.previousStatus
          ? `${humanize(entry.previousStatus)} → ${humanize(entry.newStatus)}`
          : humanize(entry.newStatus)}
      </p>
      <p className="text-xs text-muted-foreground">
        {entry.changedBy.name} · {formatDateTime(entry.createdAt)}
      </p>
      {entry.note && <p className="mt-1">{entry.note}</p>}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
