import Link from "next/link";
import { Suspense } from "react";
import { verifyProviderSession } from "../../lib/provider-auth";
import { verifyBuyerSession } from "../../lib/buyer-auth";
import { logOutBuyer } from "../actions/buyer-auth";
import { appUrl, loginUrl } from "../../lib/urls";
import { CapabilityNav, ModalityFilterBar } from "./MarketplaceFilters";

export default async function MarketplaceNav() {
  const [session, buyer] = await Promise.all([
    verifyProviderSession(),
    verifyBuyerSession(),
  ]);

  return (
    <header className="marketNavWrap">
      <nav className="marketNav">
        <Link href="/" className="navLogo" aria-label="Butter — marketplace">
          Butter
        </Link>
        {/* useSearchParams needs a Suspense boundary so the rest of the
            header can still be prerendered. */}
        <Suspense fallback={<div className="marketNavCapabilities" />}>
          <CapabilityNav />
        </Suspense>
        <div className="marketNavActions">
          {/* Seller-side entry point: a text link, not a button, so it reads as
              a cross-audience aside rather than competing with the buyer CTAs. */}
          <a
            href={session ? appUrl("/") : loginUrl("/signup")}
            className="marketNavSellLink"
          >
            Sell on Butter
          </a>
          {buyer ? (
            <>
              <span className="marketNavAccount" title={buyer.email}>
                {buyer.name}
              </span>
              <form action={logOutBuyer}>
                <button type="submit" className="marketNavLogin">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="marketNavLogin">
                Log in
              </Link>
              <Link href="/signup" className="marketNavSignup">
                Create an account
              </Link>
            </>
          )}
        </div>
      </nav>
      <ModalityFilterBar />
    </header>
  );
}
