"use client"
import Image from "next/image"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useCurrency } from "@/lib/currency-context"

// This would normally come from an API
const categories = [
  {
    id: "pizza",
    name: "Pizza",
    image: "/placeholder.svg?height=200&width=200",
    items: [
      { id: 1, name: "Margherita", price: 12.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 2, name: "Pepperoni", price: 14.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 3, name: "Vegetarian", price: 13.99, image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "burgers",
    name: "Burgers",
    image: "/placeholder.svg?height=200&width=200",
    items: [
      { id: 4, name: "Classic Burger", price: 9.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 5, name: "Cheese Burger", price: 10.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 6, name: "Veggie Burger", price: 8.99, image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "salads",
    name: "Salads",
    image: "/placeholder.svg?height=200&width=200",
    items: [
      { id: 7, name: "Caesar Salad", price: 8.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 8, name: "Greek Salad", price: 9.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 9, name: "Garden Salad", price: 7.99, image: "/placeholder.svg?height=100&width=100" },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    image: "/placeholder.svg?height=200&width=200",
    items: [
      { id: 10, name: "Chocolate Cake", price: 6.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 11, name: "Cheesecake", price: 7.99, image: "/placeholder.svg?height=100&width=100" },
      { id: 12, name: "Ice Cream", price: 4.99, image: "/placeholder.svg?height=100&width=100" },
    ],
  },
]

export function CategoryTabs() {
  const { convertPrice, formatPrice } = useCurrency()

  return (
    <Tabs defaultValue="pizza" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-2 py-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
            </div>
            <span>{category.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {category.items.map((item) => (
              <Link key={item.id} href={`/menu/${item.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-primary font-semibold">{formatPrice(convertPrice(item.price))}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={`/menu?category=${category.id}`} className="text-primary font-medium hover:underline">
              View all {category.name}
            </Link>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
