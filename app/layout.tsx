import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { EVENT_NAME, EVENT_TAGLINE, EVENT_DURATION, TEAM_SIZE, EVENT_YEAR, TOTAL_TEAMS } from "@/constants";

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
  title: `${EVENT_NAME} — ${EVENT_TAGLINE}`,
  description: `${EVENT_NAME} is a ${EVENT_DURATION.toLowerCase()} by MGM's College of Engineering, Nanded. ${TOTAL_TEAMS} of ${TEAM_SIZE}, cutting-edge technology, amazing prizes, and an unforgettable experience. Register now!`,
  keywords: [
    EVENT_NAME,
    "hackathon",
    "MGM College of Engineering",
    "Nanded",
    "metaverse",
    "coding competition",
    "tech event",
    `${EVENT_YEAR}`,
  ],
  openGraph: {
    title: `${EVENT_NAME} — ${EVENT_TAGLINE}`,
    description: `Join ${TOTAL_TEAMS} for a ${EVENT_DURATION.toLowerCase()} at MGM's College of Engineering, Nanded. Compete, innovate, and win amazing prizes!`,
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
