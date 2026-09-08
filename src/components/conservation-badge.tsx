import { cn } from "@/lib/utils";

export function ConservationBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const tone =
    status === "CR" || status === "EX" || status === "EW"
      ? "bg-red-700 text-white border-red-800"
      : status === "EN" || status === "VU"
        ? "bg-amber-700 text-white border-amber-800"
        : status === "LC"
          ? "bg-moss text-paper border-moss-dark"
          : "bg-bark/10 text-ink border-bark/20";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tone,
      )}
    >
      {label}
    </span>
  );
}
