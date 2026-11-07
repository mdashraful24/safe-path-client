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
import { formatDate, formatDateTime, humanize } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import {
  deletionRequestSchema,
  emailChangeSchema,
  passwordChangeSchema,
} from "@/validation";

const cardClassName =
  "rounded-3xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-24px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-900/60";

const labelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400";

const inputClassName =
  "h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-950/40";

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-800/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/20 sm:px-10 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-emerald-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <Shield className="size-3.5" />
              Account control center
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Account Settings
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Manage your identity, sign-in security, and account lifecycle from
              one secure place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
              <User className="size-3.5 text-emerald-300" />
              {humanize(user.role)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-200">
              <CheckCircle2 className="size-3.5" />
              {humanize(user.status)}
            </span>
          </div>
        </div>
      </section>

      {deletionPending && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300/80 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold">Deletion review in progress</p>
            <p className="mt-0.5 text-xs text-amber-700/90 dark:text-amber-300/80">
              Some account actions are restricted while an administrator reviews
              your request.
            </p>
          </div>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className={`${cardClassName} overflow-hidden`}>
            <div className="h-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
            <div className="px-6 pb-6">
              <div className="-mt-10 flex items-end justify-between gap-3">
                <div className="relative">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      width={88}
                      height={88}
                      className="size-22 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900"
                    />
                  ) : (
                    <div className="flex size-22 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-3xl font-bold text-white ring-4 ring-white dark:ring-slate-900">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="profile-image"
                    aria-label="Change profile picture"
                    className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white ring-4 ring-white transition-colors hover:bg-emerald-500 dark:ring-slate-900"
                  >
                    <Camera className="size-4" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      autoComplete="off"
                      onChange={(event) => setImage(event.target.files?.[0])}
                      className="sr-only"
                    />
                  </label>
                </div>
                <span className="mb-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {humanize(user.role)}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <p className="mt-0.5 break-all text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="profile-image"
                  className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <Camera className="size-3.5" />
                  Change photo
                </label>
                {user.imageUrl && (
                  <button
                    type="button"
                    disabled={removeImage.isPending}
                    onClick={handleRemoveImage}
                    className="text-xs font-semibold text-rose-600 transition-colors hover:text-rose-700 disabled:opacity-60 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    {removeImage.isPending ? "Removing..." : "Remove photo"}
                  </button>
                )}
              </div>
              {image && (
                <p className="mt-1.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                  Selected: {image.name}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
                  <Mail className="size-3" />
                  {isGoogleAccount ? "Google account" : "Email & password"}
                </span>
                <span
                  className={
                    deletionPending
                      ? "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300"
                      : "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                  }
                >
                  <CheckCircle2 className="size-3" />
                  {humanize(user.status)}
                </span>
              </div>

              <dl className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Email status
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Member since
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Last sign-in
                  </dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {formatDateTime(user.lastLoginAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className={`${cardClassName} p-5`}>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 dark:bg-emerald-500/15">
                <Shield className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Keep your account secure
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Use a unique password and review your sign-in details
                  regularly. Contact the SafePath team if you notice unusual
                  activity.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Contact support →
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <section className={cardClassName}>
            <div className="flex items-start gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <User className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Update the name shown on your reports and comments.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="profile-name">
                  Full Name
                </label>
                <Input
                  id="profile-name"
                  value={name}
                  placeholder={user.name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Name and photo changes are applied together when you save.
                </p>
                <Button
                  type="button"
                  disabled={updateProfile.isPending}
                  onClick={handleProfileUpdate}
                  className="w-full rounded-xl bg-emerald-600 px-5 font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 sm:w-auto"
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
          </section>

          <section className={cardClassName}>
            <div className="flex items-start gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Security & Credentials
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {isGoogleAccount
                    ? "This account is authenticated through Google."
                    : isAdmin
                      ? "Admins must request credential updates from a super admin."
                      : "Update your email address or password."}
                </p>
              </div>
            </div>

            <div className="p-6">
              {isGoogleAccount ? (
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                  <Mail className="mt-0.5 size-5 shrink-0 text-slate-500 dark:text-slate-400" />
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Google accounts do not use SafePath passwords. To update
                    account details, manage your profile in Google Account
                    settings.
                  </p>
                </div>
              ) : isAdmin ? (
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 size-5 shrink-0 text-slate-500 dark:text-slate-400" />
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                      As an Administrator, email and password modifications
                      require Super Admin verification for security auditing.
                    </p>
                  </div>
                  <Link
                    href="/admin/change-request"
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25"
                  >
                    Submit a change request
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Change email address
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Current address: {user.email}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className={labelClassName} htmlFor="new-email">
                          New email
                        </label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className={inputClassName}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          className={labelClassName}
                          htmlFor="email-password"
                        >
                          Current password
                        </label>
                        <Input
                          id="email-password"
                          type="password"
                          placeholder="Enter your password"
                          value={emailPassword}
                          onChange={(event) =>
                            setEmailPassword(event.target.value)
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={updateProfile.isPending}
                        onClick={handleEmailChange}
                        className="w-full rounded-xl sm:w-auto"
                      >
                        Send Verification Code
                      </Button>
                    </div>
                  </div>

                  {showEmailVerification && (
                    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <Mail className="size-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                            Verify your new email
                          </h4>
                          <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                            We sent a 6-digit confirmation code to your new
                            address.
                          </p>
                        </div>
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
                          className="w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-500 sm:w-auto"
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

                  <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Change password
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Choose a strong password you do not use elsewhere.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="flex flex-col gap-2">
                        <label
                          className={labelClassName}
                          htmlFor="current-password"
                        >
                          Current password
                        </label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(event) =>
                            setCurrentPassword(event.target.value)
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          className={labelClassName}
                          htmlFor="new-password"
                        >
                          New password
                        </label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="New password"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          className={labelClassName}
                          htmlFor="confirm-password"
                        >
                          Confirm password
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={updateProfile.isPending}
                        onClick={handlePasswordChange}
                        className="w-full rounded-xl sm:w-auto"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-rose-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-24px_rgba(244,63,94,0.25)] dark:border-rose-900/50 dark:bg-slate-900/60">
            <div className="flex items-start gap-4 border-b border-rose-100 bg-rose-50/40 p-6 dark:border-rose-900/40 dark:bg-rose-950/10">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-rose-900 dark:text-rose-300">
                  Danger Zone
                </h2>
                <p className="mt-0.5 text-xs text-rose-600/80 dark:text-rose-400/80">
                  Irreversible account actions
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Request account deletion
                </span>
                <p className="max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Once approved by administrators, your profile will be
                  deactivated. You can restore your account within the grace
                  window from the login page.
                </p>
              </div>

              <Button
                type="button"
                variant="destructive"
                disabled={deletionPending}
                onClick={() => setDeleteOpen(true)}
                className="w-full shrink-0 rounded-xl font-semibold sm:w-auto"
              >
                Request Deletion
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Account Deletion?</DialogTitle>
            <DialogDescription>
              Your account will be restricted immediately while administrators
              process your request. You may optionally provide a reason below.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Tell us why you are requesting account deletion (optional)"
            value={deleteReason}
            onChange={(event) => setDeleteReason(event.target.value)}
            className="min-h-28 rounded-2xl"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={requestDeletion.isPending}
              onClick={handleDeleteAccount}
              className="rounded-xl font-semibold"
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
