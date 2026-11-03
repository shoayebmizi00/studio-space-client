import { Aperture } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg",
          dark ? "bg-primary" : "bg-foreground"
        )}
      >
        <Aperture
          className={cn("size-4", dark ? "text-foreground" : "text-primary")}
        />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">StudioSpace</span>
    </Link>
  );
}
