const LOGIN_URL = (process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://login.trybutter.ai").replace(
  /\/$/,
  ""
);
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://app.trybutter.ai").replace(/\/$/, "");

/** The seller login/signup app is always a separate origin from this one. */
export function loginUrl(path = "/login"): string {
  return `${LOGIN_URL}${path}`;
}

/** The seller workbench is always a separate origin from this one. */
export function appUrl(path = "/"): string {
  return `${APP_URL}${path}`;
}
