"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useLogin } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";

export interface DemoAccount {
  label: string;
  email: string;
  password: string;
}

export default function QuickLogin({ accounts }: { accounts: DemoAccount[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();

  if (accounts.length === 0) {
    return null;
  }

  const handleQuickLogin = (account: DemoAccount) => {
    setPendingEmail(account.email);

    login(
      {
        email: account.email,
        password: account.password,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Login successful",
            description: `Logged in as ${account.label}.`,
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["USER"] });
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.add({
            title: "Login failed",
            description: getErrorMessage(error),
            type: "error",
          });
        },
        onSettled: () => {
          setPendingEmail(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Quick login (demo)
      </p>
      <div className="grid grid-cols-3 gap-2">
        {accounts.map((account) => {
          const isCurrent = pendingEmail === account.email;

          return (
            <Button
              key={account.email}
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleQuickLogin(account)}
            >
              {isCurrent ? (
                <>
                  <Spinner />
                  Logging in...
                </>
              ) : (
                account.label
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
