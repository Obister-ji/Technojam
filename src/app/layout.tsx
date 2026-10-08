import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { RevealObserver } from "@/components/layout/RevealObserver";
import "./globals.css";

// Body voice: a geometric grotesk that reads well small on dark.
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Display voice: chunky 8-bit capitals, like a game title screen.
const pixel = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Metadata labels only — not worth a preload on the critical path.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.technojam.in"),
};

export const viewport: Viewport = {
  themeColor: "#05050b",
  colorScheme: "dark",
};

/**
 * Opt into reveal animations before first paint. If the app hasn't
 * hydrated within 4s (slow network, blocked JS), drop the class so
 * content can never stay hidden.
 */
const JS_FLAG = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('tj-ready'))d.classList.remove('js')},4000)})(document.documentElement);`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${grotesk.variable} ${pixel.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Script id="tj-js-flag" strategy="beforeInteractive">
          {JS_FLAG}
        </Script>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
