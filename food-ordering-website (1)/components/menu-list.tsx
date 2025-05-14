import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import AddToCart from "@/components/add-to-cart"
import { CurrencyDisplay } from "@/components/currency-display"

// This would normally come from an API
const menuItems = [
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
    name: "Pepperoni Pizza",
    description: "Pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "pizza",
  },
  {
    id: 3,
    name: "Vegetarian Pizza",
    description: "Pizza with tomato sauce, mozzarella, and mixed vegetables",
    price: 13.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "pizza",
  },
  {
    id: 4,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and special sauce",
    price: 9.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "burgers",
  },
  {
    id: 5,
    name: "Cheese Burger",
    description: "Beef patty with cheese, lettuce, tomato, and special sauce",
    price: 10.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "burgers",
  },
  {
    id: 6,
    name: "Veggie Burger",
    description: "Plant-based patty with lettuce, tomato, and special sauce",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "burgers",
  },
  {
    id: 7,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "salads",
  },
  {
    id: 8,
    name: "Greek Salad",
    description: "Fresh vegetables with feta cheese, olives, and vinaigrette",
    price: 9.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "salads",
  },
]

export function MenuList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
            <CurrencyDisplay price={item.price} />
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/menu/${item.id}`}>View Details</Link>
            </Button>
            <AddToCart item={item} />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
