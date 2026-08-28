import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

const KEY_BYTES = 64;
const SALT_BYTES = 16;

/**
 * scrypt rather than bcrypt/argon2 so password storage needs no native
 * dependency — `node:crypto` ships with the runtime, and this is the only
 * credential path in the app. The scheme is stored in the hash itself
 * (`scrypt$salt$key`) so a stronger one can be introduced later and the two
 * can coexist while rows are rehashed on next successful login.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const key = await scrypt(password.normalize("NFKC"), salt, KEY_BYTES);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string | null
): Promise<boolean> {
  if (!stored) return false;

  const [scheme, salt, keyHex] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  if (expected.length === 0) return false;

  const actual = await scrypt(password.normalize("NFKC"), salt, expected.length);
  return timingSafeEqual(expected, actual);
}
