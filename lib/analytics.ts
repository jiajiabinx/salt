import posthog from "posthog-js";

/** True after instrumentation-client initialized PostHog with a real phc_ token. */
export function isPostHogReady(): boolean {
  return Boolean((posthog as { __loaded?: boolean }).__loaded);
}

export function capture(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!isPostHogReady()) return;
  posthog.capture(event, properties);
}

export function identify(
  distinctId: string,
  properties?: Record<string, unknown>,
): void {
  if (!isPostHogReady()) return;
  posthog.identify(distinctId, properties);
}
