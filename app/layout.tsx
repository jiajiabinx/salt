import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MarketplaceNav from "./components/MarketplaceNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://marketplace.trybutter.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Butter Marketplace — Robotics training data, direct from the source",
    template: "%s | Butter Marketplace",
  },
  description:
    "Human demonstration data for robot learning, licensed direct from the professional cleaners, warehouse crews, and trade experts who recorded it. No aggregator markup.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Butter Marketplace",
    title: "Butter Marketplace — Robotics training data, direct from the source",
    description:
      "Human demonstration data for robot learning, licensed direct from the people who recorded it.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Butter Marketplace",
    description:
      "Human demonstration data for robot learning, licensed direct from the people who recorded it.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Butter Marketplace",
  url: SITE_URL,
  description:
    "Butter Marketplace connects AI labs to human demonstration data recorded by professional tradespeople, licensed direct with no aggregator markup.",
  brand: {
    "@type": "Brand",
    name: "Butter",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORG_JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        <div className="marketRoot">
          <MarketplaceNav />
          {children}
        </div>
      </body>
    </html>
  );
}
