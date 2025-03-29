import { SearchForm } from "@/components/search-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Movie Streaming Finder</h1>
        <SearchForm />
        <div className="mt-12">
          <p className="text-center text-muted-foreground">
            Search for a movie to see details and streaming availability
          </p>
        </div>
      </div>
    </div>
  )
}

