import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HackSpectra 2025 — Metaverse Beyond Reality",
  description:
    "HackSpectra is a 24-hour hackathon by MGM's College of Engineering, Nanded. 45 teams, cutting-edge technology, amazing prizes, and an unforgettable experience. Register now!",
  keywords: [
    "HackSpectra",
    "hackathon",
    "MGM College of Engineering",
    "Nanded",
    "metaverse",
    "coding competition",
    "tech event",
    "2025",
  ],
  openGraph: {
    title: "HackSpectra 2025 — Metaverse Beyond Reality",
    description:
      "Join 45 teams for a 24-hour hackathon at MGM's College of Engineering, Nanded. Compete, innovate, and win amazing prizes!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
