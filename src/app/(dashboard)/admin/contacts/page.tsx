"use client";

import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
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
  useAdminContactMessages,
  useReplyToAdminContactMessage,
} from "@/hooks";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import type {
  AdminContactMessage,
  ContactMessageStatus,
  ContactTopic,
} from "@/types";

const PAGE_SIZE = 10;

const statusOptions: Array<{
  value: "" | ContactMessageStatus;
  label: string;
}> = [
  { value: "", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
];

const topicOptions: Array<{ value: "" | ContactTopic; label: string }> = [
  { value: "", label: "All topics" },
  { value: "GENERAL", label: "General question" },
  { value: "REPORT_ISSUE", label: "Incident report issue" },
  { value: "ACCOUNT", label: "Account help" },
  { value: "SAFETY", label: "Safety concern" },
  { value: "PARTNERSHIP", label: "Partnership or press" },
  { value: "OTHER", label: "Something else" },
];

const topicLabels: Record<ContactTopic, string> = {
  GENERAL: "General question",
  REPORT_ISSUE: "Incident report issue",
  ACCOUNT: "Account help",
  SAFETY: "Safety concern",
  PARTNERSHIP: "Partnership or press",
  OTHER: "Something else",
};

export default function AdminContactsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"" | ContactMessageStatus>("");
  const [topic, setTopic] = useState<"" | ContactTopic>("");
  const [detailTarget, setDetailTarget] = useState<AdminContactMessage | null>(
    null,
  );
  const [replyTarget, setReplyTarget] = useState<AdminContactMessage | null>(
    null,
  );
  const [replyMessage, setReplyMessage] = useState("");

  const { data, isPending } = useAdminContactMessages({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    status: status || undefined,
    topic: topic || undefined,
    sortOrder: "desc",
  });

  const replyToMessage = useReplyToAdminContactMessage();

  const messages = data?.data ?? [];
  const meta = data?.meta;

  const openReply = (message: AdminContactMessage) => {
    setDetailTarget(null);
    setReplyTarget(message);
    setReplyMessage("");
  };

  const handleReply = () => {
    if (!replyTarget) return;

    if (replyMessage.trim().length < 2) {
      toast.add({
        title: "Reply required",
        description: "Please enter at least 2 characters.",
        type: "error",
      });
      return;
    }

    replyToMessage.mutate(
      {
        contactId: replyTarget.id,
        payload: { message: replyMessage.trim() },
      },
      {
        onSuccess: (response) => {
          const emailSent = response.data?.emailSent;
          toast.add({
            title: emailSent ? "Reply sent" : "Reply saved",
            description: emailSent
              ? `Your reply was emailed to ${replyTarget.email}.`
              : "The reply was saved, but the email could not be sent.",
            type: emailSent ? "success" : "error",
          });
          setReplyTarget(null);
          setReplyMessage("");
        },
        onError: (error) => {
          toast.add({
            title: "Reply failed",
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
        <h1 className="text-xl font-bold tracking-tight">Contact messages</h1>
        <p className="text-sm text-muted-foreground">
          Read messages sent from the contact form and reply by email.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name, email, subject or message"
          value={searchTerm}
          className="w-full sm:w-72"
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
        />
        <NativeSelect
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | ContactMessageStatus);
            setPage(1);
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Filter by topic"
          value={topic}
          onChange={(event) => {
            setTopic(event.target.value as "" | ContactTopic);
            setPage(1);
          }}
        >
          {topicOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
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
                  <TableHead>Sender Name</TableHead>
                  <TableHead>Sender Email</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No contact messages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{topicLabels[message.topic]}</TableCell>
                      <TableCell
                        className="max-w-64 truncate"
                        title={message.subject}
                      >
                        {message.subject}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={message.status} />
                      </TableCell>
                      <TableCell>{formatDateTime(message.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDetailTarget(message)}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell className="text-end">
                        <Button
                          type="button"
                          size="sm"
                          disabled={Boolean(message.reply)}
                          onClick={() => openReply(message)}
                        >
                          Reply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{meta ? `${meta.total} messages` : ""}</span>
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
        <DialogContent className="sm:max-w-2xl">
          {detailTarget && (
            <>
              <DialogHeader>
                <DialogTitle>{detailTarget.subject}</DialogTitle>
                <DialogDescription>
                  From {detailTarget.name} ({detailTarget.email}) ·{" "}
                  {formatDateTime(detailTarget.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={detailTarget.status} />
                <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {topicLabels[detailTarget.topic]}
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-lg border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                {detailTarget.message}
              </div>

              {detailTarget.reply && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Reply
                  </span>
                  <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3 text-sm whitespace-pre-wrap dark:border-emerald-800/40 dark:bg-emerald-950/30">
                    {detailTarget.reply}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {detailTarget.repliedBy?.name ?? "SafePath Support"} ·{" "}
                    {formatDateTime(detailTarget.repliedAt)}
                  </span>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDetailTarget(null)}
                >
                  Close
                </Button>
                <Button type="button" onClick={() => openReply(detailTarget)}>
                  {detailTarget.reply ? "Send another reply" : "Reply"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(replyTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setReplyTarget(null);
            setReplyMessage("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {replyTarget?.name}</DialogTitle>
            <DialogDescription>
              Your reply will be emailed to {replyTarget?.email} and the message
              will be marked as resolved.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Write your reply"
            value={replyMessage}
            className="min-h-32"
            onChange={(event) => setReplyMessage(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReplyTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={replyToMessage.isPending}
              onClick={handleReply}
            >
              {replyToMessage.isPending ? (
                <>
                  <Spinner />
                  Sending...
                </>
              ) : (
                "Send reply"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
