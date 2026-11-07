"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NativeSelect from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useSubmitContactMessage } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";
import type { ContactTopic } from "@/types";
import { contactMessageSchema } from "@/validation";

const topics: Array<{ value: ContactTopic; label: string }> = [
  { value: "GENERAL", label: "General question" },
  { value: "REPORT_ISSUE", label: "Issue with an incident report" },
  { value: "ACCOUNT", label: "Account help" },
  { value: "SAFETY", label: "Safety concern" },
  { value: "PARTNERSHIP", label: "Partnership or press" },
  { value: "OTHER", label: "Something else" },
];

const fieldClassName =
  "h-11 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none transition-colors focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950";

export default function ContactForm() {
  const { mutate: submitMessage, isPending } = useSubmitContactMessage();
  const [receipt, setReceipt] = useState<{ id: string; email: string } | null>(
    null,
  );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      topic: "GENERAL" as ContactTopic,
      subject: "",
      message: "",
    },
    validators: {
      onSubmit: contactMessageSchema,
    },
    onSubmit: ({ value }) => {
      submitMessage(value, {
        onSuccess: (response) => {
          setReceipt({ id: response.data?.id ?? "", email: value.email });
          form.reset();
          toast.add({
            title: "Message sent",
            description: "Thanks for reaching out. We will reply by email.",
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Could not send your message",
            description: getErrorMessage(error),
            type: "error",
          });
        },
      });
    },
  });

  if (receipt) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-white px-6 py-16 text-center shadow-xs dark:border-emerald-900/60 dark:bg-slate-900">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Message sent
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Thanks for reaching out. Our team will review your message and reply
          to <span className="font-medium">{receipt.email}</span> within 1-2
          business days.
        </p>
        {receipt.id && (
          <p className="mt-5 rounded-full bg-slate-100 px-4 py-1.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Reference: {receipt.id.slice(0, 8).toUpperCase()}
          </p>
        )}
        <Button
          type="button"
          onClick={() => setReceipt(null)}
          className="mt-7 h-11 rounded-full bg-emerald-500 px-6 font-semibold text-white hover:bg-emerald-600"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Send us a message
        </h2>
        <p className="mt-1.5 text-md text-slate-600 dark:text-slate-400">
          Share as much detail as you can so we can help quickly. Fields marked
          with <span className="text-destructive">*</span> are required.
        </p>
      </div>

      <form
        className="mt-7 flex flex-col gap-7.5"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Full name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Your name"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  className={fieldClassName}
                />
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive" role="alert">
                    {field.state.meta.errors
                      .map((error) =>
                        typeof error === "string" ? error : error?.message,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Email address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="you@example.com"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  className={fieldClassName}
                />
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive" role="alert">
                    {field.state.meta.errors
                      .map((error) =>
                        typeof error === "string" ? error : error?.message,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="topic">
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>
                What can we help with?{" "}
                <span className="text-destructive">*</span>
              </Label>
              <NativeSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.target.value as ContactTopic)
                }
                onBlur={field.handleBlur}
                className={fieldClassName}
              >
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
          )}
        </form.Field>

        <form.Field name="subject">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="A short summary of your message"
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  className={fieldClassName}
                />
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive" role="alert">
                    {field.state.meta.errors
                      .map((error) =>
                        typeof error === "string" ? error : error?.message,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={field.name}>
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {field.state.value.length}/5000
                  </span>
                </div>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Tell us what happened, what you need help with, or what you would like to report."
                  aria-invalid={isInvalid}
                  className="min-h-40 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950"
                />
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive" role="alert">
                    {field.state.meta.errors
                      .map((error) =>
                        typeof error === "string" ? error : error?.message,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          By submitting this form, you agree to our{" "}
          <Link
            href="/privacy-policy"
            className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline"
          >
            Privacy Policy
          </Link>
          . We use your details only to respond to your message.
        </p>

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-full bg-emerald-500 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 sm:w-auto sm:px-8"
        >
          {isPending ? (
            <>
              <Spinner />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
