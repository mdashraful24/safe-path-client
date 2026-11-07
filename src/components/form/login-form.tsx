"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuickLogin, { type DemoAccount } from "@/components/form/quick-login";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useLogin } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import { loginSchema } from "@/validation";

export default function LoginForm({
  demoAccounts = [],
}: {
  demoAccounts?: DemoAccount[];
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginProcessing, setIsLoginProcessing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoginProcessing(true);
      login(value, {
        onSuccess: () => {
          toast.add({
            title: "Login successful",
            description: "Welcome back to SafePath.",
            type: "success",
          });
          form.reset();
          setShowPassword(false);
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
        onSettled: () => setIsLoginProcessing(false),
      });
    },
  });

  return (
    <div className="flex flex-col gap-7">
      {/* Heading */}
      <div className="flex flex-col gap-1 mt-5 lg:mt-0">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-md md:text-lg">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Form */}
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Email field */}
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 top-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all"
                  >
                    Email address
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder=" "
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    aria-invalid={isInvalid}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-0 border-b-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:bg-emerald-50/30 dark:focus:bg-emerald-950/30 transition-all duration-200"
                  />
                </div>
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-xs mt-0.5 ml-1">
                    {field.state.meta.errors
                      .map((e) => (typeof e === "string" ? e : e?.message))
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Password field */}
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <div className="flex items-center justify-between absolute left-4 right-4 top-2">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-slate-600 dark:text-slate-400"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    aria-invalid={isInvalid}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-0 border-b-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 px-4 pt-7 pb-3 pr-12 text-sm text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:bg-emerald-50/30 dark:focus:bg-emerald-950/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoginProcessing}
                    className="absolute right-3 bottom-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-xs mt-0.5 ml-1">
                    {field.state.meta.errors
                      .map((e) => (typeof e === "string" ? e : e?.message))
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                <Link
                  href="/forgot-password"
                  className="text-sm text-end font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
            );
          }}
        </form.Field>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loginPending || isLoginProcessing}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-md tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 mt-1"
        >
          {loginPending ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          or continue with
        </span>
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
      </div>

      {/* Google login */}
      <GoogleLoginComponent
        disabled={isLoginProcessing}
        onPendingChange={setIsLoginProcessing}
      />

      {/* Quick login */}
      <QuickLogin
        accounts={demoAccounts}
        disabled={isLoginProcessing}
        onPendingChange={setIsLoginProcessing}
      />

      {/* Footer link */}
      <p className="text-center text-md text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
