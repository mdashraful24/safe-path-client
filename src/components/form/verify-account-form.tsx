"use client";

import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {email}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="otp-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleVerify();
          }}
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">Verification code</FieldLabel>
            <InputOTP
              id="otp"
              name="otp"
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setIsInvalid(false);
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
            {isInvalid && (
              <FieldError
                errors={[{ message: "Please enter the 6-digit code." }]}
              />
            )}
            {isOtpExpired ? (
              <FieldDescription>
                This code has expired. Please request a new one.
              </FieldDescription>
            ) : (
              expiresAt && (
                <FieldDescription>
                  Code expires in {formatRemainingTime()}.
                </FieldDescription>
              )
            )}
          </Field>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={resendPending}
        >
          {resendPending ? (
            <>
              <Spinner />
              Resending...
            </>
          ) : (
            "Resend code"
          )}
        </Button>
        <Button
          type="submit"
          form="otp-form"
          disabled={verifyPending || isOtpExpired}
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
      </CardFooter>
    </Card>
  );
}
