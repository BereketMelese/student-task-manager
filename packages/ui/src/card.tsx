import { type ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={clsx("border-b border-gray-100 px-5 py-4", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={clsx("px-5 py-4", className)}>{children}</div>
  );
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={clsx(
        "border-t border-gray-100 px-5 py-3 flex items-center justify-end gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}
