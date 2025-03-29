import { MovieDetails } from "@/components/movie-details";
import { MovieHero } from "@/components/movie-hero"; // Added MovieHero
import { StreamingInfo } from "@/components/streaming-info";
import { UserActivity } from "@/components/user-activity";
import { getMovieDetails, getMovieStreamingProviders } from "@/lib/movies";
import type { TmdbMovieDetails, TmdbWatchProvidersResponse } from "@/lib/types"; // Added TMDB types
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Fetch movie details for metadata generation
// Destructure id directly from params
export async function generateMetadata({ params: { id } }: { params: { id: string } }): Promise<Metadata> {
  try {
    const movieDetails = await getMovieDetails(id); // Use destructured id
    return {
      title: `${movieDetails.title} - Movie Streaming Finder`,
      description: movieDetails.overview ?? "No description available.",
      // Consider adding Open Graph images using getTmdbImageUrl
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Movie Not Found",
      description: "Could not load movie details.",
    };
  }
}

// Destructure id directly from params
export default async function MoviePage({ params: { id } }: { params: { id: string } }) {
  // Define variables to hold the fetched data
  let movieDetails: TmdbMovieDetails | null = null;
  let streamingProviders: TmdbWatchProvidersResponse | null = null;

  try {
    // Fetch details and providers concurrently
    const results = await Promise.all([
      getMovieDetails(id), // Use destructured id
      getMovieStreamingProviders(id), // Use destructured id
    ]);
    movieDetails = results[0];
    streamingProviders = results[1];

  } catch (error) {
    console.error(`Error fetching data for movie ${id}:`, error); // Use destructured id
    // Allow rendering a partial page or trigger notFound based on which fetch failed,
    // but for now, let's stick with notFound on any error.
    notFound(); // Trigger 404 if fetching fails
  }

  // Ensure data was fetched successfully before proceeding
  if (!movieDetails || !streamingProviders) {
     // This case should ideally be handled by the catch block calling notFound,
     // but adding a check here for robustness.
     console.error(`Data fetching incomplete for movie ${id}`); // Use destructured id
     notFound();
  }

  // Optional: Filter providers for a specific region, e.g., 'US'
  const usProviders = streamingProviders.results?.US;

  return (
    <div className="min-h-screen bg-background text-foreground"> {/* Use theme variables */}
      <MovieHero movie={movieDetails} /> {/* Pass fetched data */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
             <MovieDetails movie={movieDetails} /> {/* Pass fetched data */}
             {/* Pass filtered providers, link, and movie details for estimation */}
             <StreamingInfo
               providers={usProviders}
               tmdbLink={usProviders?.link}
               movieDetails={movieDetails} // Pass full details
             />
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserActivity movieId={id} /> {/* Use destructured id */}
          </div>
        </div>
      </div>
    </div>
  );
}
