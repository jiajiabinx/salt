/**
 * Password rules, kept free of `node:crypto` so the signup form (a client
 * component) can show the same minimum the server enforces without dragging
 * the hashing code into the browser bundle.
 */
export const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 200;

/** Returns an error string, or null when the password is acceptable. */
export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) return "That password is too long.";
  return null;
}
