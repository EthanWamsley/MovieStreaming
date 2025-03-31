"use client"

import type React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Redirect to the search results page with the query
      const encodedQuery = encodeURIComponent(query.trim());

      // Save to search history in localStorage (optional, keeping it for now)
      const searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      const newHistory = [
        { query, timestamp: new Date().toISOString() },
        ...searchHistory.slice(0, 9), // Keep only last 10 searches
      ]
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      router.push(`/search?query=${encodedQuery}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Add items-center to vertically align logo, input, and button */}
      <div className="flex gap-1 items-center">
        {/* Add the logo here */}
        <div className="flex-shrink-0 mr-1"> {/* Added margin-right for spacing */}
          <Image
            src="/movieStreamingLogo.png"
            alt="Movie Streaming Finder Logo"
            width={40} // Further reduced width
            height={40} // Keep height constraint for alignment
            className="object-contain" // Ensure logo scales nicely
          />
        </div>
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow" // Allow input to grow
        />
        <Button type="submit" variant="destructive"> {/* Use theme variant */}
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  )
}
