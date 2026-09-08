import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/features/auth/ui/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="px-4 py-16">
      <h1 className="mb-2 text-center font-display text-4xl">Sign in</h1>
      <p className="mb-8 text-center text-sm text-ink/70">
        Optional. The encyclopedia stays public. An account only saves
        favourites.
      </p>
      <AuthForm mode="sign-in" />
      <p className="mt-6 text-center text-sm">
        Need an account?{" "}
        <Link href="/sign-up" className="text-moss underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
