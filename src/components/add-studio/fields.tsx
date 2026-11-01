"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

/* Shared wizard field primitives ------------------------------------ */

const fieldClass =
  "w-full rounded-xl border border-border/70 bg-card px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25";

export function FieldShell({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-semibold tracking-tight">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={type === "number" || type === "text" ? true : false}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} h-11 bg-background`}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClass} h-11 appearance-none bg-background pr-9`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </FieldShell>
  );
}

export function AreaField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} resize-y bg-background px-3.5 py-3`}
      />
    </FieldShell>
  );
}

export function AmenityRow({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-left text-[13px] transition-colors hover:border-foreground/25",
        active && "border-foreground/25"
      )}
    >
      <Icon className="size-4 shrink-0 text-foreground/70" />
      {label}
    </button>
  );
}

export function EquipmentChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-2 text-xs transition-colors",
        active
          ? "bg-foreground font-medium text-primary"
          : "border border-border/70 bg-card text-foreground/75 hover:border-foreground/25 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/60 p-4 text-xs leading-relaxed text-muted-foreground">
      {children}
    </div>
  );
}
