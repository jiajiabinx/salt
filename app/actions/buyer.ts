"use server";

import { ensureSchema, sql } from "../../lib/db";
import { isBuyerType, isWorkEmail } from "../../lib/auth/kyb";
import { captureServerEvent } from "../../lib/posthog-server";

export type BuyerInterestFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "companyName" | "buyerType", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitBuyerInterest(
  _prev: BuyerInterestFormState,
  formData: FormData
): Promise<BuyerInterestFormState> {
  const name = (formData.get("name")?.toString() ?? "").trim();
  const email = (formData.get("email")?.toString() ?? "").trim().toLowerCase();
  const companyName = (formData.get("companyName")?.toString() ?? "").trim();
  const buyerType = formData.get("buyerType")?.toString() ?? "";
  const useCase = (formData.get("useCase")?.toString() ?? "").trim();

  const fieldErrors: BuyerInterestFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Please add your name.";
  if (!email || !EMAIL_RE.test(email)) {
    fieldErrors.email = "Enter a valid email.";
  } else if (!isWorkEmail(email)) {
    fieldErrors.email = "Use your work email — personal/free email domains aren't accepted.";
  }
  if (!companyName) fieldErrors.companyName = "Company name is required.";
  if (!isBuyerType(buyerType)) fieldErrors.buyerType = "Choose a buyer type.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Some required fields need attention.", fieldErrors };
  }

  if (!sql) {
    return { status: "error", message: "Submission is unavailable right now." };
  }

  await ensureSchema();
  await sql`
    INSERT INTO buyer_interest (name, email, company_name, buyer_type, use_case)
    VALUES (${name}, ${email}, ${companyName}, ${buyerType}, ${useCase || null})
  `;

  await captureServerEvent(`buyer:${email}`, "buyer_interest_submitted", {
    buyer_type: buyerType,
    company_name: companyName,
    $set: { email, name, company_name: companyName },
  });

  return {
    status: "success",
    message: "Request received. We'll review and follow up within two business days.",
  };
}
