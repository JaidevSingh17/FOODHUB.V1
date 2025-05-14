"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

export default function AddToCart({ item }: { item: any }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(item)

    // Show animation
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <Button
      size="sm"
      onClick={handleAddToCart}
      className={`transition-all ${isAdding ? "scale-110" : ""}`}
      disabled={isAdding}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add
    </Button>
  )
}
