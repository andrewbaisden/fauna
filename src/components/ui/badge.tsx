import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-bark/15 bg-paper px-2.5 py-0.5 text-xs font-medium text-ink/80",
        className,
      )}
      {...props}
    />
  );
}
