"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <span className="hidden text-xs text-ink/50 sm:inline">…</span>;
  }

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" size="sm">
      <Link href="/my-fauna">My Fauna</Link>
    </Button>
  );
}
