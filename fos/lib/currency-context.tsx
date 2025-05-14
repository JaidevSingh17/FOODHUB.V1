"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Currency = {
  code: string
  symbol: string
  rate: number
}

type CurrencyContextType = {
  currencies: Currency[]
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (price: number) => string
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "INR", symbol: "₹", rate: 83.12 }, // Example exchange rate (1 USD = 83.12 INR)
]

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0])

  // Load selected currency from localStorage on client side
  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency")
    if (storedCurrency) {
      try {
        const currency = JSON.parse(storedCurrency)
        setSelectedCurrency(currency)
      } catch (error) {
        console.error("Failed to parse currency from localStorage:", error)
      }
    }
  }, [])

  // Save selected currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedCurrency", JSON.stringify(selectedCurrency))
  }, [selectedCurrency])

  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * selectedCurrency.rate
  }

  const formatPrice = (price: number): string => {
    return `${selectedCurrency.symbol}${price.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
