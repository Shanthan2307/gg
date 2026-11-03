import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif, Mrs_Saint_Delafield, UnifrakturCook } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", subsets: ["latin"], weight: "400" });
const gothic = UnifrakturCook({ variable: "--font-gothic", subsets: ["latin"], weight: "700" });

export const metadata: Metadata = {
  title: "Gargi Pathak — The Build Log",
  description:
    "Hackathon winner, software engineer and Girls Who Code president at Texas Tech. Tickets, receipts and stamps from the build log of Gargi Pathak.",
};

// Set the theme before paint so there's no flash
const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} ${display.variable} ${script.variable} ${gothic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
