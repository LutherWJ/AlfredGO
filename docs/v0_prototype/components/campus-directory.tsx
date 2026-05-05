"use client"

import { useState, useMemo } from "react"
import { LogOut } from "lucide-react"
import { campusDirectory, type ServiceCategory } from "@/lib/campus-directory-data"
import { SearchInput } from "./search-input"
import { CategoryItem } from "./category-item"
import { CategoryDetail } from "./category-detail"
import { ServiceItem } from "./service-item"

export function CampusDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)

  // Flatten all services for search
  const allServices = useMemo(() => {
    return campusDirectory.flatMap((category) =>
      category.services.map((service) => ({
        ...service,
        categoryName: category.name,
      }))
    )
  }, [])

  // Filter services when searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const query = searchQuery.toLowerCase()

    return allServices.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.categoryName.toLowerCase().includes(query)
    )
  }, [searchQuery, allServices])

  const isSearching = searchQuery.trim().length > 0

  // If a category is selected and not searching, show detail view
  if (selectedCategory && !isSearching) {
    return (
      <CategoryDetail
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary border-b border-primary/80">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <span className="text-lg font-bold text-accent-foreground">AS</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-primary-foreground">
                Alfred State
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Software & Services
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Search */}
      <div className="sticky top-[73px] z-10 bg-background pt-4 pb-2 max-w-lg mx-auto">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search services..."
        />
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto pb-6">

        {/* Search Results */}
        {isSearching ? (
          searchResults.length > 0 ? (
            <section className="mb-6">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Search Results ({searchResults.length})
              </h2>
              <div className="mx-4 overflow-hidden rounded-xl border border-border divide-y divide-border">
                {searchResults.map((service, index) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    isFirst={index === 0}
                    isLast={index === searchResults.length - 1}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="mx-4 py-12 text-center">
              <p className="text-muted-foreground">
                No services found for &quot;{searchQuery}&quot;
              </p>
            </div>
          )
        ) : (
          /* Category List */
          <section className="mb-6">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </h2>
            <div className="mx-4 overflow-hidden rounded-xl border border-border divide-y divide-border">
              {campusDirectory.map((category, index) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onClick={() => setSelectedCategory(category)}
                  isFirst={index === 0}
                  isLast={index === campusDirectory.length - 1}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Logout Section */}
      <div className="max-w-lg mx-auto px-4 pb-4">
        <button
          onClick={() => {
            // Handle logout logic here
            console.log("Logout clicked")
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 active:bg-destructive/15 px-4 py-3 text-destructive font-medium transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-4 py-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Need help? Contact IT Services at helpdesk@alfredstate.edu
        </p>
        <p className="text-xs text-muted-foreground/70 text-center mt-1">
          Alfred State College &bull; SUNY College of Technology
        </p>
      </footer>
    </div>
  )
}
