"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "../../lib/db";
import { hashPassword, verifyPassword } from "../../lib/auth/passwords";
import {
  endBuyerSession,
  findBuyerByEmail,
  startBuyerSession,
  type BuyerStatus,
} from "../../lib/buyer-auth";
import { emailDomain } from "../../lib/auth/kyb";
import { captureServerEvent } from "../../lib/posthog-server";

/**
 * A hash of a random string, verified against when the email matches no
 * account. Without it, an unknown email answers in a fraction of the time a
 * known one takes — which would hand back the account-existence answer the
 * shared error message is there to withhold.
 */
let unknownEmailHash: Promise<string> | null = null;
function decoyHash(): Promise<string> {
  unknownEmailHash ??= hashPassword(randomBytes(32).toString("hex"));
  return unknownEmailHash;
}

export type BuyerLoginFormState = {
  status: "idle" | "error";
  message?: string;
};

/** Why a real, correctly-authenticated account still can't sign in. */
const STATUS_BLOCKED: Record<Exclude<BuyerStatus, "approved">, string> = {
  pending:
    "Your access request is still under review — we'll email your sign-in details once it's approved.",
  rejected:
    "This account isn't approved for marketplace access. Reply to our email if you think that's wrong.",
  suspended: "This account is suspended. Get in touch and we'll sort it out.",
};

export async function logInBuyer(
  _prev: BuyerLoginFormState,
  formData: FormData
): Promise<BuyerLoginFormState> {
  const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase();
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }
  if (!sql) {
    return { status: "error", message: "Sign-in is unavailable right now." };
  }

  const buyer = await findBuyerByEmail(email);

  // Same message — and the same amount of work — for "no such account" and
  // "wrong password", so the form can't be used to enumerate which emails
  // have buyer accounts.
  const ok = await verifyPassword(password, buyer ? buyer.passwordHash : await decoyHash());
  if (!buyer || !ok) {
    return { status: "error", message: "That email and password don't match an account." };
  }

  if (buyer.status !== "approved") {
    return { status: "error", message: STATUS_BLOCKED[buyer.status] };
  }

  await startBuyerSession(buyer.buyerId);
  await captureServerEvent(`buyer:${buyer.email}`, "buyer_logged_in", {
    email_domain: emailDomain(buyer.email),
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logOutBuyer(): Promise<void> {
  await endBuyerSession();
  revalidatePath("/", "layout");
  redirect("/");
}
