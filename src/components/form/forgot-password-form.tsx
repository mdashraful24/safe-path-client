"use client";

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

  if (step === "email") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email and we will send you a verification code.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="forgot-password-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendOtp();
            }}
          >
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
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
            form="forgot-password-form"
            className="w-full"
            disabled={sendPending}
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
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter the code sent to {email} and choose a new password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="reset-password-form"
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleResetPassword();
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
            {expiresAt && !isOtpExpired && (
              <p className="text-sm text-muted-foreground">
                Code expires in {formatRemainingTime()}.
              </p>
            )}
            {isOtpExpired && (
              <p className="text-sm text-muted-foreground">
                This code has expired. Please resend a new one.
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setError("");
              }}
              autoComplete="new-password"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm the new password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError("");
              }}
              autoComplete="new-password"
            />
          </Field>

          {error && <FieldError errors={[{ message: error }]} />}
        </form>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={resendPending}
        >
          {resendPending ? (
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
          form="reset-password-form"
          disabled={resetPending || isOtpExpired}
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
      </CardFooter>
    </Card>
  );
}
