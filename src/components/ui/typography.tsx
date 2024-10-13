import { cn } from "@/lib/utils";
import React from "react";

export function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 text-text">
      {children}
    </blockquote>
  );
}

export function H1({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-normal text-text lg:text-5xl",
        className,
      )}
      style={style}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        className,
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-text first:mt-0",
      )}
    >
      {children}
    </h2>
  );
}

export function H3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight text-text",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function H4({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight text-text",
        className,
      )}
      style={style}
    >
      {children}
    </h4>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-text">
      {children}
    </code>
  );
}

export function TypographyLead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "ml-1 mt-4 text-lg tracking-normal text-textSecondary",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function P({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center font-normal leading-7 text-text [&:not(:first-child)]:mt-4",
        className,
      )}
    >
      {children}
    </p>
  );
}
