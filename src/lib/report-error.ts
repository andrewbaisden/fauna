import * as Sentry from "@sentry/nextjs";

export function reportError(name: string, error: unknown): void {
  const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }
  Sentry.captureException(error, { tags: { fauna_event: name } });
}
