import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-slate-6 rounded-lg border bg-background text-card-foreground shadow-md md:shadow-lg",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeClassName?: string;
}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardHeaderProps
>(({ className, badgeClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-slate-6 relative flex flex-col space-y-1.5 border-b p-6 px-6 py-4",
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        "absolute left-6 top-0 h-2 w-32 rounded-b-full",
        badgeClassName ? badgeClassName : "bg-primary/30 dark:bg-primary/10",
      )}
    />{" "}
    {props.children}
  </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "min-w-full border-separate border-spacing-0 border-none p-6 px-4 py-4 text-left",
      className,
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-slate-6 flex items-center justify-between border-t p-6 px-5 py-4",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-slate-6 flex items-center justify-between border-y",
      className,
    )}
    {...props}
  />
));

CardBody.displayName = "CardBody";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardBody,
};
