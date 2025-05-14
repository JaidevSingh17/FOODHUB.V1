"use client"

import { useCart } from "@/lib/cart-context"
import { useCurrency } from "@/lib/currency-context"
import { Separator } from "@/components/ui/separator"

export default function OrderSummary() {
  const { cartItems, totalPrice } = useCart()
  const { convertPrice, formatPrice } = useCurrency()

  const convertedTotalPrice = convertPrice(totalPrice)
  const deliveryFee = convertPrice(3.99)
  const tax = convertedTotalPrice * 0.08
  const total = convertedTotalPrice + deliveryFee + tax

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{formatPrice(convertPrice(item.price * item.quantity))}</span>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
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
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}
