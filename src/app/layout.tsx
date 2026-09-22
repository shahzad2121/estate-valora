import { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/**
 * Stable root shell — must NOT remount on locale change
 * (avoids full-document blink when switching FR/EN).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr-CA"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
