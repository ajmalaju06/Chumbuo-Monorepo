"use client";

import { useId } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

export function Field({ label, name, error, hint, className, ...input }: FieldProps) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="text-meta">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          "min-h-12 w-full rounded-none border-0 border-b bg-transparent px-0 text-lead outline-none",
          "border-pine/35 transition-colors placeholder:text-ink-muted/60 focus:border-pine",
          "focus-visible:outline-none aria-invalid:border-danger",
        )}
        {...input}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  className,
  tone = "pine",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  tone?: "pine" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-meta transition-colors duration-300",
        "disabled:cursor-progress disabled:opacity-70",
        tone === "pine"
          ? "bg-pine text-oatmeal hover:bg-pine-soft"
          : "border border-current hover:bg-pine hover:text-oatmeal",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Form-level outcome, announced to screen readers when it changes. */
export function FormMessage({
  children,
  tone = "error",
}: {
  children?: React.ReactNode;
  tone?: "error" | "success";
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "text-sm empty:hidden",
        tone === "error" ? "text-danger" : "border-l-2 border-lilac-deep pl-3 text-pine",
      )}
    >
      {children}
    </p>
  );
}
