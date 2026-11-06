"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NativeSelect from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateAdminChangeRequest } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import type { AdminChangeRequestPayload } from "@/types";
import { adminChangeRequestSchema } from "@/validation";

export default function ChangeRequestBodyPage() {
  const [type, setType] = useState<AdminChangeRequestPayload["type"]>("EMAIL");
  const [reason, setReason] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const createRequest = useCreateAdminChangeRequest();

  const handleSubmit = () => {
    const payload: AdminChangeRequestPayload =
      type === "EMAIL"
        ? { type: "EMAIL", reason, requestedEmail }
        : { type: "PASSWORD", reason, newPassword };

    const result = adminChangeRequestSchema.safeParse(payload);

    if (!result.success) {
      toast.add({
        title: "Check your input",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    createRequest.mutate(result.data, {
      onSuccess: (response) => {
        toast.add({
          title: "Request submitted",
          description: response.message,
          type: "success",
        });
        setReason("");
        setRequestedEmail("");
        setNewPassword("");
      },
      onError: (error) => {
        toast.add({
          title: "Request failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Change request</h1>
        <p className="text-sm text-muted-foreground">
          Ask a super admin to update your email or password.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New request</CardTitle>
          <CardDescription>
            Your current credentials stay active until a super admin approves
            the request.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="change-type">
              Change type
            </label>
            <NativeSelect
              id="change-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as AdminChangeRequestPayload["type"])
              }
            >
              <option value="EMAIL">Email</option>
              <option value="PASSWORD">Password</option>
            </NativeSelect>
          </div>

          {type === "EMAIL" ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="new-email">
                New email
              </label>
              <Input
                id="new-email"
                type="email"
                placeholder="new@example.com"
                value={requestedEmail}
                onChange={(event) => setRequestedEmail(event.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="new-password">
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="change-reason">
              Reason
            </label>
            <Textarea
              id="change-reason"
              placeholder="Why do you need this change?"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>

          <div>
            <Button
              type="button"
              disabled={createRequest.isPending}
              onClick={handleSubmit}
            >
              {createRequest.isPending ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
