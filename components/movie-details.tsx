import Image from "next/image";
import type { TmdbMovieDetails } from "@/lib/types"; // Use TMDB type
import { getTmdbImageUrl } from "@/lib/utils"; // Import helper from utils
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react"; // Add icon for money
import { Building } from "lucide-react"; // Add icon for companies/distributors
// Removed unused icons: CalendarDays, Clock, Star

interface MovieDetailsProps {
  movie: TmdbMovieDetails; // Use TMDB type
  distributors?: string[]; // Added optional distributors prop
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  if (!amount || amount === 0) return 'N/A'; // Handle zero or undefined
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Destructure movie AND distributors from props
export function MovieDetails({ movie, distributors }: MovieDetailsProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path, 'w500'); // Get poster URL

  return (
    // Removed the redundant hero section, keeping only details relevant here
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Poster Image */}
      {posterUrl && (
         <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-[2/3] relative rounded overflow-hidden shadow-lg">
              <Image
                src={posterUrl}
                alt={`Poster for ${movie.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw" // Optimize image loading
              />
            </div>
         </div>
      )}

      {/* Text Details */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-3">Overview</h2>
        <p className="text-muted-foreground mb-6">{movie.overview || "No overview available."}</p>

        {movie.genres && movie.genres.length > 0 && (
          <>
            <h3 className="text-lg font-medium mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>
          </>
        )}

        {/* Added Budget and Revenue Section */}
        {(movie.budget > 0 || movie.revenue > 0) && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {movie.budget > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-1 flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Budget
                </h3>
                <p className="text-lg text-foreground">{formatCurrency(movie.budget)}</p>
              </div>
            )}
            {movie.revenue > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-1 flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Box Office
                </h3>
                <p className="text-lg text-foreground">{formatCurrency(movie.revenue)}</p>
              </div>
            )}
          </div>
        )}

        {/* Added Production Companies Section */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          // Apply background and padding to the entire section wrapper
          <div className="mt-6 p-4 rounded-lg bg-secondary"> {/* Using bg-secondary for a lighter gray */}
            <h3 className="text-lg font-medium mb-3 text-secondary-foreground">Production Companies</h3> {/* Adjust text color if needed */}
            <div className="flex flex-wrap gap-4 items-center">
              {movie.production_companies.map((company) => {
                const logoUrl = getTmdbImageUrl(company.logo_path, 'w200'); // Use a suitable size
                return (
                  <div key={company.id} className="flex flex-col items-center text-center p-1"> {/* Reduced padding on item */}
                    {logoUrl ? (
                      // Remove background from individual logo wrapper, keep structure
                      <div className="relative h-12 w-24 mb-1 flex items-center justify-center">
                        <Image
                          src={logoUrl}
                          alt={`${company.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      // Display name if no logo
                      <span className="text-sm font-medium mb-1">{company.name}</span>
                    )}
                    {!logoUrl && <span className="text-xs text-muted-foreground">({company.origin_country})</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Added Distributors Section (from unreliable source) */}
        {distributors && distributors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
              <Building className="h-4 w-4 text-muted-foreground" /> {/* Use Building icon */}
              Potential Distributors (US Theatrical)
            </h3>
            <div className="flex flex-wrap gap-2">
              {distributors.map((distributor, index) => (
                <Badge key={index} variant="secondary"> {/* Use secondary variant for distinction */}
                  {distributor}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Note: Distributor information derived from release notes and may be incomplete or inaccurate.</p>
          </div>
        )}

        {/* Removed Director/Writers/Stars - requires separate credits API call */}
      </div>
    </div>
  );
}
