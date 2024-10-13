import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!", {
    duration: 2000,
    richColors: true,
    style: {
      backgroundColor: "rgba(0, 255, 0, 0.15)",
      border: "0.1px solid rgba(0, 255, 0, 0.2)",
    },
  });
};
