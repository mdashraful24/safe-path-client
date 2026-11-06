"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetMe();
  const { mutate: logout, isPending } = useLogout();

  const user = data?.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["USER"] });
        toast.add({
          title: "Logged out",
          description: "You have been signed out.",
          type: "success",
        });
        router.push("/login");
      },
      onError: (error) => {
        toast.add({
          title: "Logout failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isPending}
              >
                {isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Login
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
