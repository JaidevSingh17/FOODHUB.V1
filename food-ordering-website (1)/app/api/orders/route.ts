import { NextResponse } from "next/server"

// This would normally come from a database
const orders = [
  {
    id: "ORD-123456",
    customer: "John Doe",
    date: "2025-05-14T10:30:00",
    total: 42.99,
    status: "delivered",
    items: [
      { id: 1, name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { id: 4, name: "Classic Burger", quantity: 2, price: 9.99 },
      { id: 7, name: "Caesar Salad", quantity: 1, price: 8.99 },
    ],
  },
  {
    id: "ORD-123455",
    customer: "Jane Smith",
    date: "2025-05-14T09:15:00",
    total: 28.5,
    status: "preparing",
    items: [
      { id: 2, name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
      { id: 8, name: "Greek Salad", quantity: 1, price: 9.99 },
    ],
  },
  {
    id: "ORD-123454",
    customer: "Michael Johnson",
    date: "2025-05-13T18:45:00",
    total: 35.75,
    status: "delivered",
    items: [
      { id: 3, name: "Vegetarian Pizza", quantity: 1, price: 13.99 },
      { id: 5, name: "Cheese Burger", quantity: 2, price: 10.99 },
    ],
  },
]

export async function GET(request: Request) {
  // Get URL parameters
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const id = searchParams.get("id")

  // Filter orders based on parameters
  let filteredOrders = [...orders]

  if (status) {
    filteredOrders = filteredOrders.filter((order) => order.status === status)
  }

  if (id) {
    filteredOrders = filteredOrders.filter((order) => order.id === id)
  }

  // Simulate a slight delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(filteredOrders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.customer || !body.items || !body.total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would save to the database
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      status: "preparing",
      ...body,
    }

    // Simulate a slight delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
