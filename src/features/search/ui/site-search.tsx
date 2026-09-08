"use client";

import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { captureEvent } from "@/lib/capture-event";

export function SiteSearch() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = new FormData(event.currentTarget);
    const q = String(form.get("q") ?? "");
    captureEvent(ANALYTICS_EVENTS.speciesSearched, { q });
  }

  return (
    <form
      action="/animals"
      method="get"
      className="min-w-0 flex-1"
      role="search"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="site-search">
        Search species
      </label>
      <Input
        id="site-search"
        placeholder="Search species…"
        name="q"
        type="search"
      />
    </form>
  );
}
