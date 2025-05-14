import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Clock, Award, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About FoodHub</h1>

        <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-10">
          <Image src="/placeholder.svg?height=600&width=1200" alt="FoodHub restaurant" fill className="object-cover" />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to FoodHub, where passion for food meets convenience. Established in 2020, we've been on a mission
            to transform the way people enjoy their favorite meals by bringing the best local restaurants directly to
            your doorstep.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Our journey began with a simple idea: to create a seamless connection between food lovers and exceptional
            restaurants. Today, we're proud to partner with hundreds of restaurants across the city, offering a diverse
            range of cuisines to satisfy every craving.
          </p>

          <p className="text-lg leading-relaxed">
            At FoodHub, we believe that great food should be accessible to everyone. That's why we've built a platform
            that prioritizes quality, convenience, and customer satisfaction. Whether you're ordering a quick lunch, a
            family dinner, or catering for an event, we're committed to delivering an exceptional experience from click
            to bite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-muted-foreground">
                We partner with restaurants that share our commitment to quality ingredients and exceptional taste.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Our efficient delivery network ensures your food arrives hot and fresh, right when you need it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
              <p className="text-muted-foreground">
                We maintain rigorous standards to ensure every order meets our quality benchmarks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority, with responsive customer service available 7 days a week.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=200&width=200" alt="CEO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Rahul Sharma</h3>
            <p className="text-muted-foreground">Founder & CEO</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=200&width=200" alt="CTO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Priya Patel</h3>
            <p className="text-muted-foreground">Chief Technology Officer</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=200&width=200" alt="COO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Vikram Singh</h3>
            <p className="text-muted-foreground">Chief Operations Officer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
