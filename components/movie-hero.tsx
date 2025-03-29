import Image from "next/image";
import type { TmdbMovieDetails } from "@/lib/types"; // Use TMDB type
import { getTmdbImageUrl } from "@/lib/movies"; // Import helper

interface MovieHeroProps {
  movie: TmdbMovieDetails; // Use TMDB type
}

export function MovieHero({ movie }: MovieHeroProps) {
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'; // Format rating

  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full"> {/* Adjusted height slightly */}
      {/* Optional: Add overlay only if backdrop exists */}
      {backdropUrl && <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />}
      <Image
        src={backdropUrl || "/placeholder.svg"} // Use helper, provide fallback
        alt={`Backdrop for ${movie.title}`}
        fill
        className="object-cover object-center" // Adjusted object position
        priority
      />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 text-white shadow-lg">{movie.title}</h1>
          {movie.tagline && <p className="text-lg md:text-xl text-gray-200 mb-4 shadow-md">{movie.tagline}</p>}
          <div className="flex items-center gap-4 text-sm md:text-base text-gray-300">
            <span>{releaseYear}</span>
            {movie.runtime && <span>• {movie.runtime} min</span>}
            <span>• Rating: {rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
