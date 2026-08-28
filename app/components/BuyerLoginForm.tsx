"use client";

import { useActionState } from "react";
import { logInBuyer, type BuyerLoginFormState } from "../actions/buyer-auth";

const initialState: BuyerLoginFormState = { status: "idle" };

export default function BuyerLoginForm() {
  const [state, formAction, pending] = useActionState(logInBuyer, initialState);

  return (
    <form action={formAction} className="formGrid" aria-label="Buyer log in">
      <label className="formField formFieldWide">
        <span className="formLabel">
          Work email <span className="formReq">*</span>
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="formInput"
          aria-invalid={state.status === "error" || undefined}
        />
      </label>

      <label className="formField formFieldWide">
        <span className="formLabel">
          Password <span className="formReq">*</span>
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="formInput"
          aria-invalid={state.status === "error" || undefined}
        />
      </label>

      <div className="formFooter">
        <button type="submit" className="formBtn" disabled={pending} aria-disabled={pending}>
          {pending ? "Signing in…" : "Log in"}
          <span className="formArr" aria-hidden>
            →
          </span>
        </button>
        <p className={`formMsg formMsg-${state.status}`} aria-live="polite">
          {state.status === "error" && state.message}
        </p>
      </div>
    </form>
  );
}
