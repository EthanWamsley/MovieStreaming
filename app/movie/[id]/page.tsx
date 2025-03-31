import { MovieDetails } from "@/components/movie-details";
import { MovieHero } from "@/components/movie-hero"; // Added MovieHero
import { StreamingInfo } from "@/components/streaming-info";
import { UserActivity } from "@/components/user-activity";
import { SearchForm } from "@/components/search-form"; // Added SearchForm import
import { getMovieDetails, getMovieStreamingProviders, getMovieReleaseDates } from "@/lib/movies"; // Added getMovieReleaseDates
import type { TmdbMovieDetails, TmdbWatchProvidersResponse, TmdbReleaseDatesResponse } from "@/lib/types"; // Added TMDB types & TmdbReleaseDatesResponse
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
  let releaseDates: TmdbReleaseDatesResponse | null = null; // Added releaseDates

  try {
    // Fetch details, providers, and release dates concurrently
    const results = await Promise.all([
      getMovieDetails(id), // Use destructured id
      getMovieStreamingProviders(id), // Use destructured id
      getMovieReleaseDates(id), // Added release dates fetch
    ]);
    movieDetails = results[0];
    streamingProviders = results[1];
    releaseDates = results[2]; // Assign release dates

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

  // --- Extract Potential Distributors (Unreliable Method) ---
  let potentialDistributors: string[] = [];
  console.log("Release dates:", releaseDates);
  const usReleaseDates = releaseDates?.results?.find(r => r.iso_3166_1 === 'US');
  if (usReleaseDates) {
    // Look for theatrical release (type 3)
    const theatricalRelease = usReleaseDates.release_dates.find(d => d.type === 3);
    if (theatricalRelease?.note) {
      // Very basic check: if 'note' contains "Distributed by", extract the rest
      const match = theatricalRelease.note.match(/Distributed by (.*)/i);
      if (match && match[1]) {
        // Split potential multiple distributors listed after "Distributed by"
        potentialDistributors = match[1].split(/[,&]/).map(name => name.trim()).filter(Boolean);
      } else if (!theatricalRelease.note.toLowerCase().includes('premiere')) {
        // Fallback: If no "Distributed by" and not a premiere note, maybe the note *is* the distributor?
        // This is highly speculative.
        potentialDistributors = [theatricalRelease.note.trim()];
      }
    }
  }
  // --- End Distributor Extraction ---


  // Optional: Filter providers for a specific region, e.g., 'US'
  const usProviders = streamingProviders.results?.US;


  return (
    // Add relative positioning to the main wrapper
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Position SearchForm absolutely over the hero */}
      <div className="absolute top-0 left-0 right-0 z-30 container mx-auto px-4 pt-6 pb-4"> {/* Adjust padding as needed */}
        {/* Optional: Add a subtle background for readability: bg-black/20 backdrop-blur-sm rounded-b-lg p-4 */}
        <SearchForm />
      </div>
      <MovieHero movie={movieDetails} /> {/* Pass fetched data */}
      {/* Add top padding to this container to prevent content from going under the absolute search bar */}
      <div className="container mx-auto px-4 py-8 pt-24"> {/* Increased pt to account for search bar height */}
        {/* Removed SearchForm from here */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
             {/* Pass movie details and potential distributors */}
             <MovieDetails movie={movieDetails} distributors={potentialDistributors} />
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
