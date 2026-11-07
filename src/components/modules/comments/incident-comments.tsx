"use client";

import Link from "next/link";
import { useState } from "react";
import { CommentsSkeleton } from "@/components/skeletons/incident-skeletons";
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
import { Spinner } from "@/components/ui/spinner";
import TablePagination from "@/components/ui/table-pagination";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useCreateComment,
  useDeleteComment,
  useGetSession,
  useIncidentComments,
  useUpdateComment,
} from "@/hooks";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type { IncidentComment } from "@/types";
import { commentSchema } from "@/validation";

const PAGE_SIZE = 10;

export default function IncidentComments({
  incidentId,
}: {
  incidentId: string;
}) {
  const { data: meData } = useGetSession();
  const currentUser = meData?.data;

  const [page, setPage] = useState(1);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IncidentComment | null>(
    null,
  );

  const { data, isPending } = useIncidentComments(incidentId, {
    page,
    limit: PAGE_SIZE,
    sortOrder: "desc",
  });
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const comments = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = () => {
    const result = commentSchema.safeParse({ content });

    if (!result.success) {
      toast.add({
        title: "Check your comment",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    createComment.mutate(
      { incidentId, content: result.data.content },
      {
        onSuccess: () => {
          setContent("");
          setPage(1);
          toast.add({
            title: "Comment posted",
            description: "Your comment is now visible.",
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Could not post comment",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleUpdate = (commentId: string) => {
    const result = commentSchema.safeParse({ content: editingContent });

    if (!result.success) {
      toast.add({
        title: "Check your comment",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    updateComment.mutate(
      {
        incidentId,
        commentId,
        content: result.data.content,
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingContent("");
          toast.add({
            title: "Comment updated",
            description: "Your changes were saved.",
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

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteComment.mutate(
      { incidentId, commentId: deleteTarget.id },
      {
        onSuccess: () => {
          setDeleteTarget(null);
          toast.add({
            title: "Comment deleted",
            description: "Your comment was removed.",
            type: "success",
          });
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
          Discuss this incident with the community.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {currentUser ? (
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Add a comment"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <div>
              <Button
                type="button"
                disabled={createComment.isPending}
                onClick={handleCreate}
              >
                {createComment.isPending ? (
                  <>
                    <Spinner />
                    Posting...
                  </>
                ) : (
                  "Post comment"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              Log in
            </Link>{" "}
            to join the conversation.
          </p>
        )}

        {isPending ? (
          <CommentsSkeleton />
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No comments yet. Start the conversation.
          </p>
        ) : (
          <div className="flex flex-col divide-y">
            {comments.map((comment) => {
              const isOwner = currentUser?.id === comment.author.id;
              const isEditing = editingId === comment.id;

              return (
                <div key={comment.id} className="flex flex-col gap-2 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">
                        {comment.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(comment.createdAt)}
                        {comment.editedAt ? " · edited" : ""}
                      </p>
                    </div>
                    {isOwner && !isEditing && (
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditingContent(comment.content);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(comment)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <Textarea
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={updateComment.isPending}
                          onClick={() => handleUpdate(comment.id)}
                        >
                          {updateComment.isPending ? <Spinner /> : null}
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">
                      {comment.content}
                    </p>
                  )}
                </div>
              );
            })}
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
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete comment?</DialogTitle>
            <DialogDescription>
              This removes your comment from the incident page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
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
