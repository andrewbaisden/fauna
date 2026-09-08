"use client";

import { useEffect } from "react";
import { captureEvent } from "@/lib/capture-event";

export function PageEvent({
  event,
  properties,
}: {
  event: string;
  properties?: Record<string, string | number | boolean | null>;
}) {
  const encoded = JSON.stringify(properties ?? {});

  useEffect(() => {
    const parsed = JSON.parse(encoded) as Record<
      string,
      string | number | boolean | null
    >;
    captureEvent(event, Object.keys(parsed).length > 0 ? parsed : undefined);
  }, [event, encoded]);

  return null;
}
