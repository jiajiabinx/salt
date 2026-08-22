import type { Metadata } from "next";
import Link from "next/link";
import { loginUrl } from "../../lib/urls";

export const metadata: Metadata = {
  title: "Buyer log in",
  description:
    "Log in to your Butter buyer account. Buyer accounts are issued once an access request is approved.",
  alternates: { canonical: "/login" },
  robots: { index: false },
};

/**
 * Placeholder for buyer sign-in.
 *
 * There is no buyer auth yet — `buyer_interest` records access requests, and
 * accounts are provisioned by hand after review. This page exists so the nav's
 * "Log in" CTA has an honest destination instead of a dead link, and should be
 * replaced by the real sign-in form once buyer accounts are issued.
 */
export default function MarketplaceLoginPage() {
  return (
    <main className="formSection">
      <div className="formEyebrow">Embodied Data Marketplace</div>
      <h1 className="formH1">Buyer log in.</h1>
      <p className="formIntro">
        Buyer accounts are issued once we&apos;ve reviewed your access request. If
        yours is approved and you haven&apos;t received your sign-in details yet,
        reply to that email and we&apos;ll sort it out.
      </p>

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
