"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useCurrency } from "@/lib/currency-context"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { convertPrice, formatPrice } = useCurrency()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=checkout")
      return
    }

    setIsCheckingOut(true)

    // Simulate checkout process
    setTimeout(() => {
      router.push("/checkout")
    }, 1000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="max-w-md mx-auto bg-muted/30 rounded-lg p-8">
          <p className="text-xl mb-6">Your cart is empty</p>
          <Button asChild>
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  const convertedTotalPrice = convertPrice(totalPrice)
  const deliveryFee = convertPrice(3.99)
  const tax = convertedTotalPrice * 0.08
  const finalTotal = convertedTotalPrice + deliveryFee + tax

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatPrice(convertPrice(item.price))}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>

                    <div className="text-right font-medium w-20">
                      {formatPrice(convertPrice(item.price * item.quantity))}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(convertedTotalPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <div className="pt-4">
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => router.push("/menu")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
