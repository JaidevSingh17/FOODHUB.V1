import { Suspense } from "react"
import { MenuList } from "@/components/menu-list"
import { MenuFilters } from "@/components/menu-filters"

export default function MenuPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <aside className="md:sticky md:top-20 h-fit">
          <MenuFilters />
        </aside>

        <main>
          <Suspense fallback={<div className="text-center py-12">Loading menu items...</div>}>
            <MenuList />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
