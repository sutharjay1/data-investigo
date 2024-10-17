import { cn } from "@/lib/utils";
import React from "react";

type InnerLayoutProps = {
  children: React.ReactNode;
  label: string;
  button?: React.ReactNode;
  className?: string;
};

const InnerLayout = ({
  children,
  label,
  button,
  className,
}: InnerLayoutProps) => {
  return (
    <div className="scrollContainer relative pb-10 pt-4">
      {/* <div className="pointer-events-none fixed left-0 right-0 top-0 z-10 h-20 bg-gradient-to-b from-rose-600 to-transparent opacity-80" /> */}

      <div className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-3 pb-2 md:px-6">
        <h1 className="relative text-2xl font-bold leading-tight tracking-tight text-text md:text-4xl">
          {label}
          <span
            className="absolute -right-3 bottom-1 h-2 w-2 rounded-full bg-green-600"
            aria-hidden="true"
          />
        </h1>
        {button}
      </div>

      <div
        className={cn(
          "relative z-20 mx-auto max-w-5xl px-3 md:px-6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default InnerLayout;
