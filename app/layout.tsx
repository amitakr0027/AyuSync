// import type React from "react"
// import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Playfair_Display, Inter } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import { Suspense } from "react"
// import "./globals.css"

// const playfairDisplay = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
//   display: "swap",
// })

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// })

// export const metadata: Metadata = {
//   title: "AyuSync - Healthcare Bridge | NAMASTE & ICD-11 Integration",
//   description:
//     "Revolutionary healthcare platform seamlessly integrating NAMASTE & ICD-11 codes into digital health systems. Experience the future of unified healthcare coding that bridges traditional and modern medicine.",
//   generator: "v0.app",
//   keywords: "healthcare, NAMASTE, ICD-11, medical coding, digital health, healthcare integration, medical platform",
//   authors: [{ name: "AyuSync Team" }],
//   openGraph: {
//     title: "AyuSync - Healthcare Bridge",
//     description: "Seamlessly integrate NAMASTE & ICD-11 codes into digital health systems",
//     type: "website",
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className="scroll-smooth">
//       <body
//         className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}
//       >
//         <Suspense fallback={null}>{children}</Suspense>
//         <Analytics />
//       </body>
//     </html>
//   )
// }

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AyuSync - Healthcare Bridge | NAMASTE & ICD-11 Integration",
  description:
    "Revolutionary healthcare platform seamlessly integrating NAMASTE & ICD-11 codes into digital health systems. Experience the future of unified healthcare coding that bridges traditional and modern medicine.",
  generator: "v0.app",
  keywords: "healthcare, NAMASTE, ICD-11, medical coding, digital health, healthcare integration, medical platform",
  authors: [{ name: "AyuSync Team" }],
  openGraph: {
    title: "AyuSync - Healthcare Bridge",
    description: "Seamlessly integrate NAMASTE & ICD-11 codes into digital health systems",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}