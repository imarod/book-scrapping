import { Fraunces, Public_Sans,  } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
    variable: "--font-display",
    weight: ["400", "500", "600"],
})



const publicSans = Public_Sans ({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: "Katalog Buku",
  description: "Hasil scraping books.toscrape.com",
}

export default function RootLayout ({children}) {
  return (
    <html lang="id"
      className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-[#EFE9DC] text-[#14181C]"
        style={{fontFamily: "var(--font-body)"}}>
          {children}
        </body>
    </html>
  )
}