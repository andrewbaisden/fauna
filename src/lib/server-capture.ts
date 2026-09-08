import { PostHog } from "posthog-node";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    return null;
  }
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    });
  }
  return client;
}

export function captureServerEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null>,
): void {
  const posthog = getClient();
  if (!posthog) {
    return;
  }
  posthog.capture({
    distinctId: "fauna-server",
    event,
    properties,
  });
}
