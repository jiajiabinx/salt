import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import BuyerInterestForm from "../components/BuyerInterestForm";

export const metadata: Metadata = {
  title: "Sign up as a buyer",
  description:
    "Request buyer access to Butter — browse pricing, sample episodes, and licensing terms, and talk directly to the people who collected the data.",
  alternates: { canonical: "/signup" },
};

export default function MarketplaceSignupPage() {
  return (
    <main className="formSection formSectionWide">
      <div className="formEyebrow">Physical AI Marketplace</div>
      <h1 className="formH1">Request buyer access.</h1>
      <p className="formIntro">
        Access unlocks pricing, sample episodes, and licensing terms on every
        listing — plus a direct line to the provider who recorded the data. Tell us
        what your models need and we&apos;ll follow up.
      </p>

      <Suspense fallback={null}>
        <BuyerInterestForm />
      </Suspense>

      <p className="formSwitch">
        <Link href="/">← Back to the marketplace</Link>
      </p>
    </main>
  );
}
