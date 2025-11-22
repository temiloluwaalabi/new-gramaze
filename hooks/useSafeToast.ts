"use client";

import { useRef } from "react";
import { toast } from "sonner";

type ToastOptions = Parameters<typeof toast.success>[1];

export default function useSafeToast() {
  const activeToasts = useRef<Set<string>>(new Set());

  const showToast = (
    id: string,
    message: string,
    type: "success" | "error" | "info" | "warning",
    options?: ToastOptions
  ) => {
    if (activeToasts.current.has(id)) return;
    activeToasts.current.add(id);

    toast.dismiss(id);

    toast[type](message, {
      id,
      ...options,
      onDismiss: (toastInstance) => {
        activeToasts.current.delete(id);
        options?.onDismiss?.(toastInstance);
      },
    });
  };

  const safeSuccess = (id: string, message: string, options?: ToastOptions) => {
    showToast(id, message, "success", options);
  };

  const safeError = (id: string, message: string, options?: ToastOptions) => {
    showToast(id, message, "error", options);
  };

  const safeInfo = (id: string, message: string, options?: ToastOptions) => {
    showToast(id, message, "info", options);
  };

  const safeWarning = (id: string, message: string, options?: ToastOptions) => {
    showToast(id, message, "warning", options);
  };

  return { safeSuccess, safeError, safeInfo, safeWarning };
}
