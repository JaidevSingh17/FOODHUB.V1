"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Add parallax effect on successful order completion
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const scrollY = window.scrollY
      const elements = containerRef.current.querySelectorAll(".parallax-item")

      elements.forEach((el, index) => {
        const speed = 0.1 * (index + 1)
        const yPos = scrollY * speed

        if (el instanceof HTMLElement) {
          el.style.transform = `translateY(${yPos}px)`
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="container mx-auto py-16 px-4 text-center min-h-[80vh] flex flex-col items-center justify-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 parallax-item">
        <Check className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-4xl font-bold mb-4 parallax-item">Order Placed Successfully!</h1>

      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto parallax-item">
        Thank you for your order. We're preparing your delicious food and will deliver it soon.
      </p>

      <div className="bg-muted/30 rounded-lg p-6 mb-8 max-w-md mx-auto parallax-item">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p className="mb-2">
          Order #: <span className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
        </p>
        <p className="mb-2">
          Estimated Delivery: <span className="font-medium">30-45 minutes</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 parallax-item">
        <Button asChild size="lg">
          <Link href="/menu">Order More</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
