"use client";

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
import {
  useForgotPassword,
  useResendForgotPasswordOtp,
  useResetPassword,
} from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import { forgotPasswordSchema, resetPasswordSchema } from "@/validation";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [remaining, setRemaining] = useState(0);

  const { mutate: sendOtp, isPending: sendPending } = useForgotPassword();
  const { mutate: resendOtp, isPending: resendPending } =
    useResendForgotPasswordOtp();
  const { mutate: resetPassword, isPending: resetPending } = useResetPassword();

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

  const handleSendOtp = () => {
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email.");
      return;
    }

    setError("");

    sendOtp(result.data, {
      onSuccess: (response) => {
        setEmail(result.data.email);
        setStep("reset");
        setExpiresAt(response.data?.expiresAt ?? "");
        toast.add({
          title: "Code sent",
          description:
            "If an account exists for that email, a verification code was sent.",
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
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      return;
    }

    resendOtp(result.data, {
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

  const handleResetPassword = () => {
    const result = resetPasswordSchema.safeParse({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check your input.");
      return;
    }

    setError("");

    resetPassword(
      {
        email: result.data.email,
        otp: result.data.otp,
        newPassword: result.data.newPassword,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Password reset",
            description: "You can now log in with your new password.",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err) => {
          toast.add({
            title: "Reset failed",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  /* ── Step 1: Email ── */
  if (step === "email") {
    return (
      <div className="flex flex-col gap-7">
        {/* Step dots */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-emerald-500" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Forgot password?
          </h1>
          <p className="text-md md:text-lg">
            Enter your email and we&apos;ll send you a verification code.
          </p>
        </div>

        <form
          id="forgot-password-form"
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendOtp();
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="relative group">
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-sm font-medium text-slate-600"
              >
                Email address
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
                className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-0.5 ml-1">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            form="forgot-password-form"
            disabled={sendPending}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-md tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 mt-1"
          >
            {sendPending ? (
              <>
                <Spinner />
                Sending code...
              </>
            ) : (
              "Send verification code"
            )}
          </Button>
        </form>

        <p className="text-center text-md text-slate-500">
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  /* ── Step 2: Reset ── */
  const isOtpExpired = Boolean(expiresAt) && remaining <= 0;

  return (
    <div className="flex flex-col gap-7">
      {/* Step dots */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-200" />
        <span className="h-2 w-6 rounded-full bg-emerald-500" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Reset password
        </h1>
        <p className="text-sm text-slate-500">
          Enter the code sent to{" "}
          <span className="font-medium text-slate-700">{email}</span> and choose
          a new password.
        </p>
      </div>

      <form
        id="reset-password-form"
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleResetPassword();
        }}
      >
        {/* OTP slots */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-500 ml-1">
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
                className="size-11 rounded-xl border-slate-200 bg-slate-50 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={1}
                className="size-11 rounded-xl border-slate-200 bg-slate-50 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={2}
                className="size-11 rounded-xl border-slate-200 bg-slate-50 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={3}
                className="size-11 rounded-xl border-slate-200 bg-slate-50 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={4}
                className="size-11 rounded-xl border-slate-200 bg-slate-50 text-base font-semibold focus:border-emerald-500"
              />
              <InputOTPSlot
                index={5}
                className="size-11 rounded-xl border-slate-200 bg-slate-50 text-base font-semibold focus:border-emerald-500"
              />
            </InputOTPGroup>
          </InputOTP>

          {expiresAt && !isOtpExpired && (
            <p className="text-xs text-slate-500 ml-1">
              Code expires in{" "}
              <span className="font-semibold text-emerald-600">
                {formatRemainingTime()}
              </span>
            </p>
          )}
          {isOtpExpired && (
            <p className="text-xs text-amber-600 ml-1">
              This code has expired. Please resend a new one.
            </p>
          )}
        </div>

        {/* New password */}
        <div className="relative group">
          <label
            htmlFor="newPassword"
            className="absolute left-4 top-2 text-xs font-medium text-slate-500"
          >
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder=" "
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setError("");
            }}
            autoComplete="off"
            className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
          />
        </div>

        {/* Confirm password */}
        <div className="relative group">
          <label
            htmlFor="confirmPassword"
            className="absolute left-4 top-2 text-xs font-medium text-slate-500"
          >
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder=" "
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError("");
            }}
            autoComplete="off"
            className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
          />
        </div>

        {error && <p className="text-red-500 text-xs ml-1">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendPending}
            className="flex-1 h-12 rounded-full border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200 disabled:opacity-50"
          >
            {resendPending ? (
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
            form="reset-password-form"
            disabled={resetPending || isOtpExpired}
            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-sm tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25"
          >
            {resetPending ? (
              <>
                <Spinner />
                Resetting...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
