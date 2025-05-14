import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeaturedItems from "@/components/featured-items"
import { CategoryTabs } from "@/components/category-tabs"

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Delicious food"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Delicious Food <br />
            Delivered To Your Door
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-lg">
            Browse our menu, place your order, and enjoy a delicious meal without leaving your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/menu">
                Order Now <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Items</h2>
          <FeaturedItems />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse By Category</h2>
          <CategoryTabs />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Menu</h3>
              <p className="text-muted-foreground">
                Explore our wide range of delicious meals and select your favorites.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Order</h3>
              <p className="text-muted-foreground">
                Add items to your cart, review your order, and proceed to checkout.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Meal</h3>
              <p className="text-muted-foreground">We'll prepare and deliver your order right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
