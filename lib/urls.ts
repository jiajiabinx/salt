const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://app.trybutter.ai").replace(/\/$/, "");

/**
 * The seller login/signup and the workbench both live on app.trybutter.ai
 * (login isn't a separate subdomain) — this app is always a different
 * origin from that one either way.
 */
export function loginUrl(path = "/login"): string {
  return `${APP_URL}${path}`;
}

export function appUrl(path = "/"): string {
  return `${APP_URL}${path}`;
}
