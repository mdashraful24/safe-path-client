"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRequestAccountRestore, useVerifyAccountRestore } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import { restoreAccountSchema, verifyRestoreSchema } from "@/validation";

export default function RestoreAccountForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [remaining, setRemaining] = useState(0);

  const { mutate: requestRestore, isPending: requestPending } =
    useRequestAccountRestore();
  const { mutate: verifyRestore, isPending: verifyPending } =
    useVerifyAccountRestore();

  useEffect(() => {
    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();

    const updateRemaining = () => {
      const seconds = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setRemaining(seconds);
    };

    updateRemaining();
    const timerId = setInterval(updateRemaining, 1000);

    return () => clearInterval(timerId);
  }, [expiresAt]);

  const formatRemainingTime = () => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRequest = () => {
    const result = restoreAccountSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email.");
      return;
    }

    setError("");

    requestRestore(result.data, {
      onSuccess: (response) => {
        setEmail(result.data.email);
        setStep("verify");
        setExpiresAt(response.data?.expiresAt ?? "");
        toast.add({
          title: "Request received",
          description:
            "If the account is eligible, a verification code was sent to its email.",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Request failed",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  const handleResend = () => {
    const result = restoreAccountSchema.safeParse({ email });

    if (!result.success) {
      return;
    }

    requestRestore(result.data, {
      onSuccess: (response) => {
        setOtp("");
        setExpiresAt(response.data?.expiresAt ?? "");
        toast.add({
          title: "Code sent",
          description: "A new verification code has been sent.",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Could not resend code",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  const handleVerify = () => {
    const result = verifyRestoreSchema.safeParse({ email, otp });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check your input.");
      return;
    }

    setError("");

    verifyRestore(result.data, {
      onSuccess: () => {
        toast.add({
          title: "Account restored",
          description: "You are signed in again. Welcome back.",
          type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["USER"] });
        router.push("/dashboard");
      },
      onError: (err) => {
        toast.add({
          title: "Restore failed",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  /* ── Step 1: Email ── */
  if (step === "email") {
    return (
      <div className="flex flex-col gap-7">
        {/* Step dots */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-emerald-500" />
          <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Icon */}
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200 dark:ring-emerald-500/30">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Restore account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deleted accounts can be restored while the restore window is open.
          </p>
        </div>

        <form
          id="restore-account-form"
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleRequest();
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="relative group">
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-sm font-medium text-slate-500 dark:text-slate-400"
              >
                Account email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                autoComplete="off"
                aria-invalid={Boolean(error)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-0 border-b-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:bg-emerald-50/30 dark:focus:bg-emerald-950/30 transition-all duration-200"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-0.5 ml-1">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            form="restore-account-form"
            disabled={requestPending}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-md tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 mt-1"
          >
            {requestPending ? (
              <>
                <Spinner />
                Sending code...
              </>
            ) : (
              "Send restore code"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            href="/login"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            ← Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  /* ── Step 2: Verify ── */
  const isOtpExpired = Boolean(expiresAt) && remaining <= 0;

  return (
    <div className="flex flex-col gap-7">
      {/* Step dots */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-200" />
        <span className="h-2 w-6 rounded-full bg-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Verify restore
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter the code sent to{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {email}
          </span>{" "}
          to restore your account.
        </p>
      </div>

      <form
        id="verify-restore-form"
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          handleVerify();
        }}
      >
        {/* OTP slots */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="otp"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1"
          >
            Verification code
          </label>
          <InputOTP
            id="otp"
            name="otp"
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            autoComplete="off"
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot
                index={0}
                className="size-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={1}
                className="size-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={2}
                className="size-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={3}
                className="size-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={4}
                className="size-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={5}
                className="size-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-semibold focus:border-emerald-500"
              />
            </InputOTPGroup>
          </InputOTP>

          {isOtpExpired ? (
            <p className="text-xs text-amber-600 dark:text-amber-400 ml-1">
              This code has expired. Please request a new one.
            </p>
          ) : (
            expiresAt && (
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                Code expires in{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatRemainingTime()}
                </span>
              </p>
            )
          )}
          {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={requestPending}
            className="flex-1 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-200 disabled:opacity-50"
          >
            {requestPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Sending...
              </span>
            ) : (
              "Resend code"
            )}
          </button>

          <Button
            type="submit"
            form="verify-restore-form"
            disabled={verifyPending || isOtpExpired}
            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-sm tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25"
          >
            {verifyPending ? (
              <>
                <Spinner />
                Restoring...
              </>
            ) : (
              "Restore account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
