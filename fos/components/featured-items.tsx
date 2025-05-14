"use client"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useCurrency } from "@/lib/currency-context"

// This would normally come from an API
const featuredItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "pizza",
  },
  {
    id: 2,
    name: "Chicken Burger",
    description: "Grilled chicken breast with lettuce, tomato, and special sauce",
    price: 9.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "burgers",
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "salads",
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with vanilla ice cream",
    price: 6.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "desserts",
  },
]

export default function FeaturedItems() {
  const { addToCart } = useCart()
  const { convertPrice, formatPrice } = useCurrency()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
            <p className="text-lg font-bold">{formatPrice(convertPrice(item.price))}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/menu/${item.id}`}>View Details</Link>
            </Button>
            <Button size="sm" onClick={() => addToCart(item)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
