import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import BuyerLoginForm from "../components/BuyerLoginForm";
import { verifyBuyerSession } from "../../lib/buyer-auth";
import { loginUrl } from "../../lib/urls";

export const metadata: Metadata = {
  title: "Buyer log in",
  description:
    "Log in to your Butter buyer account. Buyer accounts are issued once an access request is approved.",
  alternates: { canonical: "/login" },
  robots: { index: false },
};

/**
 * Buyer sign-in: email + password only. No Google — buyers arrive through a
 * reviewed access request rather than self-serve social sign-up, so there is
 * nothing for an OAuth provider to shortcut.
 */
export default async function MarketplaceLoginPage() {
  if (await verifyBuyerSession()) redirect("/");

  return (
    <main className="formSection">
      <div className="formEyebrow">Embodied Data Marketplace</div>
      <h1 className="formH1">Buyer log in.</h1>
      <p className="formIntro">
        Sign in to see pricing, sample episodes, and licensing terms across every
        listing. Accounts go live once we&apos;ve reviewed your access request.
      </p>

      <BuyerLoginForm />

      <p className="formSwitch">
        Don&apos;t have an account yet?{" "}
        <Link href="/signup">Request buyer access</Link>
      </p>
      <p className="formSwitch">
        Selling data instead? <a href={loginUrl("/login")}>Provider log in</a>
      </p>
      <p className="formSwitch">
        <Link href="/">← Back to the marketplace</Link>
      </p>
    </main>
  );
}
