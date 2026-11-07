"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useResendRegistrationOtp, useVerifyAccount } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";

export default function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [expiresAt, setExpiresAt] = useState(
    searchParams.get("expiresAt") ?? "",
  );
  const [remaining, setRemaining] = useState(0);

  const { mutate: resendOtp, isPending: resendPending } =
    useResendRegistrationOtp();
  const { mutate: verify, isPending: verifyPending } = useVerifyAccount();

  const email = searchParams.get("email") ?? "";

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

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

  const isOtpExpired = Boolean(expiresAt) && remaining <= 0;

  const formatRemainingTime = () => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    verify(
      { email, otp },
      {
        onSuccess: () => {
          toast.add({
            title: "Email verified",
            description: "Your account is now active.",
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["USER"] });
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.add({
            title: "Verification failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  const handleResend = () => {
    resendOtp(
      { email },
      {
        onSuccess: (response) => {
          toast.add({
            title: "Code sent",
            description: "A new verification code has been sent to your email.",
            type: "success",
          });
          setOtp("");
          setIsInvalid(false);

          if (response.data?.expiresAt) {
            setExpiresAt(response.data.expiresAt);
          }
        },
        onError: (error) => {
          toast.add({
            title: "Could not resend code",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      },
    );
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Icon badge */}
      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200">
        <svg
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
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Verify your email
        </h1>
        <p className="text-sm text-slate-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-slate-700">{email}</span>
        </p>
      </div>

      <form
        id="otp-form"
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          handleVerify();
        }}
      >
        {/* OTP slots */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-500 ml-1">
            Verification code
          </label>
          <InputOTP
            id="otp"
            name="otp"
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setIsInvalid(false);
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

          {isInvalid && (
            <p className="text-red-500 text-xs ml-1">
              Please enter the 6-digit code.
            </p>
          )}
          {isOtpExpired ? (
            <p className="text-xs text-amber-600 ml-1">
              This code has expired. Please request a new one.
            </p>
          ) : (
            expiresAt && (
              <p className="text-xs text-slate-500 ml-1">
                Code expires in{" "}
                <span className="font-semibold text-emerald-600">
                  {formatRemainingTime()}
                </span>
              </p>
            )
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendPending}
            className="flex-1 h-12 rounded-full border-2 border-slate-200 text-md font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200 disabled:opacity-50"
          >
            {resendPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Resending...
              </span>
            ) : (
              "Resend code"
            )}
          </button>

          <Button
            type="submit"
            form="otp-form"
            disabled={verifyPending || isOtpExpired}
            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-md tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25"
          >
            {verifyPending ? (
              <>
                <Spinner />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
