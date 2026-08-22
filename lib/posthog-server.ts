import "server-only";
import { PostHog } from "posthog-node";

function isConfigured(token: string): boolean {
  return Boolean(token) && !token.includes("xxxxxxxx") && token.startsWith("phc_");
}

export function isPostHogServerConfigured(): boolean {
  return isConfigured(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim() ?? "");
}

export function getPostHogClient(): PostHog {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "", {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}

/**
 * Captures a single server-side event and flushes before returning. Next.js
 * server actions/route handlers can freeze the process right after the
 * response, so we can't rely on posthog-node's background flush timer here.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  if (!isPostHogServerConfigured()) return;

  const client = getPostHogClient();
  client.capture({ distinctId, event, properties });
  await client.shutdown();
}
