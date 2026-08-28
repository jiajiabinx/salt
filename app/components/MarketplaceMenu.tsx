"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DrawerBrowse, DrawerFilter } from "./MarketplaceFilters";

/**
 * The marketplace nav on a narrow screen.
 *
 * The header carries three things that each want a row of their own:
 * capability links, modality chips, and the account actions. Wrapped, they
 * eat the top half of a phone before a single listing shows. So below
 * 780px they all move behind this burger and into a side panel, and the
 * header is left as a burger and the logo.
 *
 * `account` is the same server-rendered block the wide header uses. It is
 * passed through rather than rebuilt so the sign-in state, and the log out
 * Server Action, stay defined in one place.
 */
export default function MarketplaceMenu({ account }: { account: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  // Navigating with the panel open would otherwise leave it sitting over
  // the page it just took you to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.dataset.marketDrawer = "open";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      delete document.body.dataset.marketDrawer;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="marketBurger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="marketDrawer"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className="marketBurgerBars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        className={`marketScrim${open ? " marketScrim-on" : ""}`}
        onClick={close}
        aria-hidden
      />

      <aside
        id="marketDrawer"
        className={`marketDrawer${open ? " marketDrawer-open" : ""}`}
      >
        <div className="marketDrawerTop">
          <Link href="/" className="navLogo" onClick={close} aria-label="Butter — marketplace">
            Butter
          </Link>
          <button
            type="button"
            className="marketDrawerClose"
            onClick={close}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* useSearchParams needs a boundary; the panel is closed on first
            paint either way, so there is nothing to fall back to. */}
        <Suspense fallback={null}>
          <DrawerBrowse onNavigate={close} />
          {/* Modality only narrows the listing grid, so it is not offered
              on /login and /signup, matching the wide filter row. */}
          {pathname === "/" && <DrawerFilter onNavigate={close} />}
        </Suspense>

        <div className="marketDrawerFoot">{account}</div>
      </aside>
    </>
  );
}
