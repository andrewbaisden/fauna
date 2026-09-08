"use client";

import { useEffect } from "react";
import { useRecentsStore } from "@/features/species/state";

export function RecentlyViewedTracker({ slug }: { slug: string }) {
  const push = useRecentsStore((state) => state.push);

  useEffect(() => {
    push(slug);
  }, [push, slug]);

  return null;
}
