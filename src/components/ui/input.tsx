import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "relative flex h-10 w-full select-none appearance-none rounded-md px-3 py-2 text-sm md:w-1/2",
          "outline-none transition-all duration-200 ease-in-out",

          // Light theme
          "bg-neutral-300/50 text-text",
          "placeholder:text-textSecondary/80",
          "border border-text/15",
          "focus:ring-3 focus:border-2 focus:border-ring/15 focus:ring-accent",

          // Dark theme
          // "dark:bg-neutral-900/75 dark:text-text",
          "dark:placeholder:text-textSecondary/80",
          "focus:border focus:dark:border-2 focus:dark:border-ring focus:dark:ring-accent",
          "dark:focus:ring-3 dark:focus:border-neutral-900/75 dark:focus:ring-accent",
          "flex w-full items-center justify-start bg-slate-200/5 hover:text-accent-foreground",

          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",

          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",

          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
