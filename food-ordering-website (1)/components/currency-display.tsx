"use client"

import { useCurrency } from "@/lib/currency-context"

interface CurrencyDisplayProps {
  price: number
  className?: string
}

export function CurrencyDisplay({ price, className = "text-lg font-bold" }: CurrencyDisplayProps) {
  const { convertPrice, formatPrice } = useCurrency()

  return <p className={className}>{formatPrice(convertPrice(price))}</p>
}
