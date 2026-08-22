"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { submitBuyerInterest, type BuyerInterestFormState } from "../actions/buyer";
import { BUYER_TYPES } from "../../lib/auth/kyb";
import { MIN_PASSWORD_LENGTH } from "../../lib/auth/password-rules";

const initialState: BuyerInterestFormState = { status: "idle" };

export default function BuyerInterestForm() {
  const [state, formAction, pending] = useActionState(submitBuyerInterest, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const ask = searchParams.get("ask");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const fieldErr = state.fieldErrors ?? {};

  return (
    <form
      ref={formRef}
      action={formAction}
      className="formGrid"
      aria-label="Buyer interest"
      id="buyer-interest"
    >
      <label className="formField">
        <span className="formLabel">
          Name <span className="formReq">*</span>
        </span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          className="formInput"
          aria-invalid={Boolean(fieldErr.name) || undefined}
        />
        {fieldErr.name && (
          <span className="formFieldErr" role="alert">
            {fieldErr.name}
          </span>
        )}
      </label>

      <label className="formField">
        <span className="formLabel">
          Work email <span className="formReq">*</span>
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="formInput"
          aria-invalid={Boolean(fieldErr.email) || undefined}
        />
        {fieldErr.email && (
          <span className="formFieldErr" role="alert">
            {fieldErr.email}
          </span>
        )}
      </label>

      <label className="formField">
        <span className="formLabel">
          Company name <span className="formReq">*</span>
        </span>
        <input
          name="companyName"
          type="text"
          autoComplete="organization"
          required
          className="formInput"
          aria-invalid={Boolean(fieldErr.companyName) || undefined}
        />
        {fieldErr.companyName && (
          <span className="formFieldErr" role="alert">
            {fieldErr.companyName}
          </span>
        )}
      </label>

      <label className="formField">
        <span className="formLabel">
          Buyer type <span className="formReq">*</span>
        </span>
        <select
          name="buyerType"
          defaultValue=""
          className="formInput formSelect"
          aria-invalid={Boolean(fieldErr.buyerType) || undefined}
        >
          <option value="" disabled>
            Select one
          </option>
          {BUYER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {fieldErr.buyerType && (
          <span className="formFieldErr" role="alert">
            {fieldErr.buyerType}
          </span>
        )}
      </label>

      <label className="formField">
        <span className="formLabel">
          Password <span className="formReq">*</span>
        </span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          className="formInput"
          aria-invalid={Boolean(fieldErr.password) || undefined}
        />
        {fieldErr.password ? (
          <span className="formFieldErr" role="alert">
            {fieldErr.password}
          </span>
        ) : (
          <span className="formHint">At least {MIN_PASSWORD_LENGTH} characters.</span>
        )}
      </label>

      <label className="formField">
        <span className="formLabel">
          Confirm password <span className="formReq">*</span>
        </span>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="formInput"
          aria-invalid={Boolean(fieldErr.confirmPassword) || undefined}
        />
        {fieldErr.confirmPassword && (
          <span className="formFieldErr" role="alert">
            {fieldErr.confirmPassword}
          </span>
        )}
      </label>

      <label className="formField formFieldWide">
        <span className="formLabel">What data do your models need?</span>
        <textarea
          name="useCase"
          rows={3}
          className="formInput formTextarea"
          placeholder="e.g. kitchen manipulation, 500+ hours of human demonstrations, RGB-D with force-torque"
          defaultValue={ask ? `Interested in: ${ask}` : undefined}
        />
      </label>

      <p className="formHint formFieldWide">
        For labs and enterprise data teams only — individual buyers aren&apos;t
        supported at this time. Your password is set now; sign-in opens once the
        request is approved.
      </p>

      <div className="formFooter">
        <button type="submit" className="formBtn" disabled={pending} aria-disabled={pending}>
          {pending ? "Sending…" : "Request access"}
          <span className="formArr" aria-hidden>
            →
          </span>
        </button>
        <p className={`formMsg formMsg-${state.status}`} aria-live="polite">
          {state.status === "success" && state.message}
          {state.status === "error" && !state.fieldErrors && state.message}
        </p>
      </div>
    </form>
  );
}
