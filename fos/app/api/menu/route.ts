import { NextResponse } from "next/server"

// This would normally come from a database
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

export async function GET(request: Request) {
  // Get URL parameters
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  // Filter menu items based on parameters
  let filteredItems = [...menuItems]

  if (category) {
    const categories = category.split(",")
    filteredItems = filteredItems.filter((item) => categories.includes(item.category))
  }

  if (minPrice) {
    filteredItems = filteredItems.filter((item) => item.price >= Number.parseFloat(minPrice))
  }

  if (maxPrice) {
    filteredItems = filteredItems.filter((item) => item.price <= Number.parseFloat(maxPrice))
  }

  // Simulate a slight delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(filteredItems)
}
