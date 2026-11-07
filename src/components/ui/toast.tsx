"use client";

import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ExternalToast,
  type ToasterProps,
} from "sonner";

type ToastType = "success" | "error" | "info" | "warning" | "loading" | "default";

interface ToastOptions extends ExternalToast {
  title?: ReactNode;
  description?: ReactNode;
  type?: ToastType;
}

function addToast({
  title,
  description,
  type = "default",
  ...options
}: ToastOptions) {
  const message = title ?? description ?? "";
  const payload: ExternalToast = {
    ...options,
    description: title ? description : undefined,
  };

  switch (type) {
    case "success":
      return sonnerToast.success(message, payload);
    case "error":
      return sonnerToast.error(message, payload);
    case "info":
      return sonnerToast.info(message, payload);
    case "warning":
      return sonnerToast.warning(message, payload);
    case "loading":
      return sonnerToast.loading(message, payload);
    default:
      return sonnerToast(message, payload);
  }
}

const toast = {
  add: addToast,
  success: sonnerToast.success,
  error: sonnerToast.error,
  info: sonnerToast.info,
  warning: sonnerToast.warning,
  loading: sonnerToast.loading,
  message: sonnerToast.message,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
  promise: sonnerToast.promise,
};

function Toaster({
  children,
  theme,
  ...props
}: ToasterProps & { children?: ReactNode }) {
  const { theme: appTheme } = useTheme();

  return (
    <>
      {children}
      <SonnerToaster
        theme={(theme ?? (appTheme as ToasterProps["theme"])) || "system"}
        position="top-right"
        richColors
        // closeButton
        {...props}
      />
    </>
  );
}

export { Toaster, toast };
