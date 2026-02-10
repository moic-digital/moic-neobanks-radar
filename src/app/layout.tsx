import type { Metadata } from "next"
import { Space_Mono, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CryptoAgg | The Ultimate Crypto Card Aggregator",
  description: "Compare and discover the best crypto debit and credit cards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceMono.variable} ${ibmPlexMono.variable} bg-black text-white`}
      >
        {children}
      </body>
    </html>
  )
}
