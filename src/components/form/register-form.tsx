"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRegistration } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import { registrationSchema } from "@/validation";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: registration, isPending } = useRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registrationSchema,
    },
    onSubmit: async ({ value }) => {
      registration(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: (response) => {
            toast.add({
              title: "Registration successful",
              description:
                "Check your email for the verification code to activate your account.",
              type: "success",
            });

            const params = new URLSearchParams({
              email: value.email,
              expiresAt: response.data?.expiresAt ?? "",
            });

            router.push(`/register/verify-account?${params.toString()}`);
          },
          onError: (error) => {
            toast.add({
              title: "Registration failed",
              description: getErrorMessage(error),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-7">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="text-sm text-slate-500">
          Join SafePath to report and follow safety incidents.
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
        {/* Full name */}
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 top-2 text-sm font-medium text-slate-500 transition-all"
                  >
                    Full name
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder=" "
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="name"
                    aria-invalid={isInvalid}
                    className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
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

        {/* Email */}
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 top-2 text-sm font-medium text-slate-500 transition-all"
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
                    autoComplete="email"
                    aria-invalid={isInvalid}
                    className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
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

        {/* Password */}
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 top-2 text-sm font-medium text-slate-500 transition-all"
                  >
                    Password
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="new-password"
                    aria-invalid={isInvalid}
                    className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 pr-12 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 transition-colors"
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
              </div>
            );
          }}
        </form.Field>

        {/* Confirm password */}
        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 top-2 text-sm font-medium text-slate-500 transition-all"
                  >
                    Confirm password
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder=" "
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="new-password"
                    aria-invalid={isInvalid}
                    className="w-full rounded-xl bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-emerald-500 px-4 pt-7 pb-3 pr-12 text-sm text-slate-900 placeholder-transparent focus:outline-none focus:bg-emerald-50/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
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
              </div>
            );
          }}
        </form.Field>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-md tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 mt-1"
        >
          {isPending ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Divider */}
      {/* <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          or continue with
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div> */}

      {/* Google */}
      {/* <GoogleLoginComponent /> */}

      {/* Footer link */}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
