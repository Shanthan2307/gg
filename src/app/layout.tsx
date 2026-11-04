import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif, Mrs_Saint_Delafield, UnifrakturCook } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", subsets: ["latin"], weight: "400" });
const gothic = UnifrakturCook({ variable: "--font-gothic", subsets: ["latin"], weight: "700" });

const title = "Gargi Pathak · The Build Log";
const description =
  "Hackathon winner, software engineer and Girls Who Code president at Texas Tech. Tickets, receipts and stamps from the build log of Gargi Pathak.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "The Build Log", type: "profile", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gargi Pathak",
  jobTitle: "Software engineer",
  alumniOf: "Texas Tech University",
  address: { "@type": "PostalAddress", addressLocality: "San Francisco", addressRegion: "CA" },
  sameAs: ["https://www.linkedin.com/in/garrgipathak/"],
  url: SITE_URL,
};

// Set the theme before paint so there's no flash
const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} ${display.variable} ${script.variable} ${gothic.variable} antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to the log
        </a>
        {children}
      </body>
    </html>
  );
}
