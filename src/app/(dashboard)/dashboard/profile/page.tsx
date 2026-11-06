"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UpdateProfilePayload } from "@/api";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useGetMe,
  useRemoveProfileImage,
  useRequestAccountDeletion,
  useUpdateProfile,
  useVerifyEmailChange,
} from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import {
  deletionRequestSchema,
  emailChangeSchema,
  passwordChangeSchema,
} from "@/validation";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetMe();
  const user = data?.data;

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateProfile = useUpdateProfile();
  const removeImage = useRemoveProfileImage();
  const verifyEmail = useVerifyEmailChange();
  const requestDeletion = useRequestAccountDeletion();

  if (!user) return null;

  const isGoogleAccount = user.authProvider === "GOOGLE";
  const isAdmin = user.role === "ADMIN";
  const deletionPending = user.status === "PENDING_DELETION";

  const handleProfileUpdate = () => {
    const trimmedName = name.trim();
    const payload: UpdateProfilePayload = {};

    if (trimmedName && trimmedName !== user.name) {
      payload.name = trimmedName;
    }

    if (!payload.name && !image) {
      toast.add({
        title: "Nothing to update",
        description: "Change your name or choose a new profile picture.",
        type: "info",
      });
      return;
    }

    updateProfile.mutate(
      { payload, image },
      {
        onSuccess: (response) => {
          setName("");
          setImage(undefined);
          toast.add({
            title: "Profile updated",
            description: response.message,
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

  const handleRemoveImage = () => {
    removeImage.mutate(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Profile picture removed",
          description: "Your profile picture was removed.",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Could not remove picture",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  const handleEmailChange = () => {
    const result = emailChangeSchema.safeParse({
      email,
      currentPassword: emailPassword,
    });

    if (!result.success) {
      toast.add({
        title: "Check your input",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    updateProfile.mutate(
      { payload: result.data },
      {
        onSuccess: (response) => {
          setShowEmailVerification(true);
          setEmail("");
          setEmailPassword("");
          toast.add({
            title: "Verification required",
            description: response.message,
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Email change failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleVerifyEmail = () => {
    verifyEmail.mutate(otp, {
      onSuccess: () => {
        toast.add({
          title: "Email changed",
          description: "Please log in again with your new email.",
          type: "success",
        });
        router.push("/login");
      },
      onError: (error) => {
        toast.add({
          title: "Verification failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  const handlePasswordChange = () => {
    const result = passwordChangeSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      toast.add({
        title: "Check your input",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    updateProfile.mutate(
      {
        payload: {
          currentPassword: result.data.currentPassword,
          newPassword: result.data.newPassword,
        },
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          toast.add({
            title: "Password updated",
            description: "Your password has been changed.",
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Password change failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleDeleteAccount = () => {
    const result = deletionRequestSchema.safeParse({ reason: deleteReason });

    if (!result.success) {
      toast.add({
        title: "Check your reason",
        description: result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }

    requestDeletion.mutate(result.data.reason, {
      onSuccess: () => {
        setDeleteOpen(false);
        queryClient.removeQueries({ queryKey: ["USER"] });
        toast.add({
          title: "Deletion requested",
          description: "Your account is restricted while an admin reviews it.",
          type: "success",
        });
        router.push("/login");
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and security.
        </p>
      </div>

      {deletionPending && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          Your account is pending deletion review. Some actions are restricted.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>
            {user.email} · {user.role.replace("_", " ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                width={64}
                height={64}
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              {user.imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={removeImage.isPending}
                  onClick={handleRemoveImage}
                >
                  {removeImage.isPending ? "Removing..." : "Remove picture"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="profile-name">
                Name
              </label>
              <Input
                id="profile-name"
                value={name}
                placeholder={user.name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="profile-image">
                Profile picture
              </label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0])}
              />
            </div>
          </div>

          <div>
            <Button
              type="button"
              disabled={updateProfile.isPending}
              onClick={handleProfileUpdate}
            >
              {updateProfile.isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email and password</CardTitle>
          <CardDescription>
            {isGoogleAccount
              ? "This account uses Google sign-in."
              : isAdmin
                ? "Admins must request email or password changes from a super admin."
                : "Changing your email requires a verification code."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGoogleAccount ? (
            <p className="text-sm text-muted-foreground">
              Google accounts cannot add email or password credentials.
            </p>
          ) : isAdmin ? (
            <Link
              href="/admin/change-request"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Open the change request form
            </Link>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Change email</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="email"
                    placeholder="New email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={emailPassword}
                    onChange={(event) => setEmailPassword(event.target.value)}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateProfile.isPending}
                    onClick={handleEmailChange}
                  >
                    Send verification code
                  </Button>
                </div>
              </div>

              {showEmailVerification && (
                <div className="flex flex-col gap-3 rounded-lg border p-3">
                  <p className="text-sm font-medium">
                    Enter the code sent to your new email
                  </p>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <div>
                    <Button
                      type="button"
                      disabled={verifyEmail.isPending || otp.length !== 6}
                      onClick={handleVerifyEmail}
                    >
                      {verifyEmail.isPending ? (
                        <>
                          <Spinner />
                          Verifying...
                        </>
                      ) : (
                        "Verify new email"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t pt-4">
                <p className="text-sm font-medium">Change password</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateProfile.isPending}
                    onClick={handlePasswordChange}
                  >
                    Update password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            Request account deletion. An administrator will review it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            disabled={deletionPending}
            onClick={() => setDeleteOpen(true)}
          >
            Request account deletion
          </Button>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request account deletion?</DialogTitle>
            <DialogDescription>
              Your account will be restricted immediately. You can restore it
              later from the login page if the deletion has been approved.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason (optional)"
            value={deleteReason}
            onChange={(event) => setDeleteReason(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={requestDeletion.isPending}
              onClick={handleDeleteAccount}
            >
              {requestDeletion.isPending ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
