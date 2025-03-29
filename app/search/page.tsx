import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchMovies, getTmdbImageUrl } from '@/lib/movies';
import type { TmdbMovieSearchResult } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { SearchForm } from '@/components/search-form'; // Re-use search form

interface SearchPageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

// Component to display a single movie result card
function MovieResultCard({ movie }: { movie: TmdbMovieSearchResult }) {
  const posterUrl = getTmdbImageUrl(movie.poster_path, 'w300'); // Smaller size for list
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Link href={`/movie/${movie.id}`} className="block hover:scale-105 transition-transform duration-200">
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="p-0 relative aspect-[2/3]">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`Poster for ${movie.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="bg-secondary h-full flex items-center justify-center text-muted-foreground">No Image</div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{movie.title}</CardTitle>
          <p className="text-sm text-muted-foreground mb-2">{releaseYear}</p>
          <p className="text-xs text-muted-foreground line-clamp-3">{movie.overview || 'No overview.'}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{rating}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

// Main search results component (Server Component)
async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return <p className="text-center text-muted-foreground">Please enter a search term.</p>;
  }

  try {
    const searchData = await searchMovies(query);
    const movies = searchData.results;

    if (movies.length === 0) {
      return <p className="text-center text-muted-foreground">No results found for "{query}".</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieResultCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Search failed:", error);
    return <p className="text-center text-destructive">Failed to load search results. Please try again later.</p>;
  }
}

// Search Page (Server Component using Suspense for streaming)
// Destructure query directly from searchParams
export default function SearchPage({ searchParams: { query = '' } = {} }: SearchPageProps) {
  // query is now directly available, defaulting to '' if searchParams or query is undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Include the search form again for convenience */}
        <SearchForm />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : 'Search Movies'}
      </h1>

      {/* Use Suspense for better loading state */}
      <Suspense fallback={<p className="text-center text-muted-foreground">Loading results...</p>}>
        {/* Async Server Component is fine here */}
        <SearchResults query={query} />
      </Suspense>
      {/* TODO: Add pagination controls if needed */}
    </div>
  );
}
