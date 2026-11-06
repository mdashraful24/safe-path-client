"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  KeyRound,
  Mail,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UpdateProfilePayload } from "@/api";
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
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal information, security credentials, and preferences.
        </p>
      </div>

      {deletionPending && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="size-5 shrink-0 text-amber-600" />
          <span>Your account is pending deletion review. Some actions are currently restricted.</span>
        </div>
      )}

      {/* SECTION 1: Personal Profile */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <User className="size-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Personal Information
            </h2>
            <p className="text-xs text-slate-500">
              Update your photo and display name
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Avatar Row */}
          <div className="flex items-center gap-5">
            <div className="relative">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="size-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white text-2xl font-bold ring-2 ring-slate-200 dark:ring-slate-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {user.name}
              </span>
              <span className="text-xs text-slate-500">
                {user.email} · {user.role.replace("_", " ")}
              </span>

              {user.imageUrl && (
                <button
                  type="button"
                  disabled={removeImage.isPending}
                  onClick={handleRemoveImage}
                  className="mt-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors self-start"
                >
                  {removeImage.isPending ? "Removing..." : "Remove picture"}
                </button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
                htmlFor="profile-name"
              >
                Full Name
              </label>
              <Input
                id="profile-name"
                value={name}
                placeholder={user.name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 py-2.5"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
                htmlFor="profile-image"
              >
                Upload New Photo
              </label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0])}
                className="rounded-xl border-slate-200 dark:border-slate-800 py-1.5"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              disabled={updateProfile.isPending}
              onClick={handleProfileUpdate}
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 px-6 font-semibold text-white shadow-sm shadow-emerald-500/20"
            >
              {updateProfile.isPending ? (
                <>
                  <Spinner />
                  <span>Saving changes...</span>
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Security & Credentials */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Security & Credentials
            </h2>
            <p className="text-xs text-slate-500">
              {isGoogleAccount
                ? "This account is authenticated through Google."
                : isAdmin
                  ? "Admins must request credential updates from a super admin."
                  : "Update your email address or password."}
            </p>
          </div>
        </div>

        {isGoogleAccount ? (
          <p className="text-sm text-slate-500">
            Google accounts do not use passwords. To update account details, manage your profile in Google Account settings.
          </p>
        ) : isAdmin ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              As an Administrator, email and password modifications require Super Admin verification for security auditing.
            </p>
            <Link
              href="/admin/change-request"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white dark:bg-slate-800 px-5 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors self-start mt-2"
            >
              <span>Submit a change request</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Change Email */}
            <div className="flex flex-col gap-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Change Email Address
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  type="email"
                  placeholder="New email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="Current password"
                  value={emailPassword}
                  onChange={(event) => setEmailPassword(event.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={updateProfile.isPending}
                  onClick={handleEmailChange}
                  className="rounded-full"
                >
                  Send Verification Code
                </Button>
              </div>
            </div>

            {/* Email OTP Verification */}
            {showEmailVerification && (
              <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    Verify Your New Email
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    We sent a 6-digit confirmation code to your new address.
                  </p>
                </div>
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
                    className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                  >
                    {verifyEmail.isPending ? (
                      <>
                        <Spinner />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      "Confirm & Apply Email"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Change Password */}
            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Change Password
              </span>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={updateProfile.isPending}
                  onClick={handlePasswordChange}
                  className="rounded-full"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Danger Zone */}
      <div className="rounded-3xl border border-rose-200/80 bg-rose-50/20 p-6 sm:p-8 dark:border-rose-900/50 dark:bg-rose-950/10 shadow-xs">
        <div className="flex items-center gap-3 border-b border-rose-100 dark:border-rose-900/40 pb-6 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <Trash2 className="size-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-rose-900 dark:text-rose-300">
              Danger Zone
            </h2>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
              Irreversible account actions
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Request Account Deletion
            </span>
            <p className="text-xs text-slate-500 max-w-lg">
              Once approved by administrators, your profile will be deactivated. You can restore your account within the grace window from the login page.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            disabled={deletionPending}
            onClick={() => setDeleteOpen(true)}
            className="rounded-full font-semibold shrink-0"
          >
            Request Deletion
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Request Account Deletion?</DialogTitle>
            <DialogDescription>
              Your account will be restricted immediately while administrators process your request. You may optionally provide a reason below.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Tell us why you are requesting account deletion (optional)"
            value={deleteReason}
            onChange={(event) => setDeleteReason(event.target.value)}
            className="rounded-2xl min-h-[100px]"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={requestDeletion.isPending}
              onClick={handleDeleteAccount}
              className="rounded-full font-semibold"
            >
              {requestDeletion.isPending ? (
                <>
                  <Spinner />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Deletion Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
