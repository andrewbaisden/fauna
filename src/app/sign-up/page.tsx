import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/features/auth/ui/auth-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <div className="px-4 py-16">
      <h1 className="mb-2 text-center font-display text-4xl">Create account</h1>
      <p className="mb-8 text-center text-sm text-ink/70">
        Favourites and unit preferences, nothing more required.
      </p>
      <AuthForm mode="sign-up" />
      <p className="mt-6 text-center text-sm">
        Already exploring?{" "}
        <Link href="/sign-in" className="text-moss underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
