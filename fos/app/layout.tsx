import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { MainNav } from "@/components/main-nav"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { CurrencyProvider } from "@/lib/currency-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FoodHub - Online Food Ordering",
  description: "Order delicious food online and get it delivered to your doorstep",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <div className="relative flex min-h-screen flex-col">
                  <MainNav />
                  <div className="flex-1">{children}</div>
                  <footer className="border-t py-6 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2025 FoodHub. All rights reserved.
                      </p>
                    </div>
                  </footer>
                </div>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
