"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

  if (step === "email") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Restore account</CardTitle>
          <CardDescription>
            Deleted accounts can be restored while the restore window is open.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="restore-account-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleRequest();
            }}
          >
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your account email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                autoComplete="email"
                aria-invalid={Boolean(error)}
              />
              {error && <FieldError errors={[{ message: error }]} />}
            </Field>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            form="restore-account-form"
            className="w-full"
            disabled={requestPending}
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
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const isOtpExpired = Boolean(expiresAt) && remaining <= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify restore</CardTitle>
        <CardDescription>
          Enter the code sent to {email} to restore your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="verify-restore-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleVerify();
          }}
        >
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="otp">Verification code</FieldLabel>
            <InputOTP
              id="otp"
              name="otp"
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
              autoComplete="one-time-code"
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
            {isOtpExpired ? (
              <p className="text-sm text-muted-foreground">
                This code has expired. Please request a new one.
              </p>
            ) : (
              expiresAt && (
                <p className="text-sm text-muted-foreground">
                  Code expires in {formatRemainingTime()}.
                </p>
              )
            )}
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={requestPending}
        >
          {requestPending ? (
            <>
              <Spinner />
              Sending...
            </>
          ) : (
            "Resend code"
          )}
        </Button>
        <Button
          type="submit"
          form="verify-restore-form"
          disabled={verifyPending || isOtpExpired}
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
      </CardFooter>
    </Card>
  );
}
