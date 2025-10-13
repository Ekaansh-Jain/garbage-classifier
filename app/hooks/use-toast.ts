"use client";

import { toast as sonnerToast } from "sonner";

export function useToast() {
  // Wrapper function for showing toast
  function toast(options: any) {
    sonnerToast(options);
  }

  return { toast };
}
