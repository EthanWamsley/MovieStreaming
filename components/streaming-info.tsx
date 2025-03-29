import type { TmdbWatchProvidersRegion, TmdbWatchProviderDetails, TmdbMovieDetails } from "@/lib/types"; // Use TMDB types
import { getTmdbImageUrl } from "@/lib/movies"; // Import helper
import { getStreamingEstimate } from "@/lib/constants"; // Import estimate helper
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Use Badge for type
import { Link as LinkIcon, Tv, Film, ShoppingCart, Info, Clock } from "lucide-react"; // Updated icons + Clock
import Image from "next/image";
import Link from "next/link"; // Use NextLink for external links

interface StreamingInfoProps {
  providers?: TmdbWatchProvidersRegion; // Make optional as data might be missing
  tmdbLink?: string; // Link to JustWatch via TMDB
  movieDetails: TmdbMovieDetails; // Added movie details for estimation
}

// Helper to render a list of providers
const ProviderList = ({ title, providers, type }: { title: string; providers?: TmdbWatchProviderDetails[]; type: 'Subscription' | 'Rent' | 'Buy' }) => {
  if (!providers || providers.length === 0) return null;

  return (
    <div>
      <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
        {type === 'Subscription' && <Tv className="h-4 w-4" />}
        {type === 'Rent' && <Film className="h-4 w-4" />}
        {type === 'Buy' && <ShoppingCart className="h-4 w-4" />}
        {title}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {providers.map((p) => {
          const logoUrl = getTmdbImageUrl(p.logo_path, 'w200'); // Use appropriate size
          return (
            <div key={p.provider_id} className="flex flex-col items-center text-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
              {logoUrl ? (
                <div className="relative h-10 w-10 mb-1 rounded overflow-hidden">
                  <Image src={logoUrl} alt={p.provider_name} fill className="object-contain" />
                </div>
              ) : (
                 <div className="h-10 w-10 mb-1 flex items-center justify-center bg-secondary rounded">?</div>
              )}
              <span className="text-xs text-muted-foreground">{p.provider_name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper to calculate and format estimated date
const getEstimatedDate = (releaseDateStr: string, windowDays: number): string | null => {
  if (!releaseDateStr) return null;
  try {
    const releaseDate = new Date(releaseDateStr);
    const estimatedDate = new Date(releaseDate.setDate(releaseDate.getDate() + windowDays));
    return estimatedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  } catch (e) {
    console.error("Error calculating estimated date:", e);
    return null;
  }
};

export function StreamingInfo({ providers, tmdbLink, movieDetails }: StreamingInfoProps) {
  const hasFlatrate = providers?.flatrate && providers.flatrate.length > 0;
  const hasBuyOrRent = (providers?.buy && providers.buy.length > 0) || (providers?.rent && providers.rent.length > 0);

  let estimate = null;
  let estimatedDateStr: string | null = null;
  // Only calculate estimate if flatrate is missing and we have movie details
  if (!hasFlatrate && movieDetails) {
    estimate = getStreamingEstimate(movieDetails.production_companies);
    if (estimate) {
      estimatedDateStr = getEstimatedDate(movieDetails.release_date, estimate.windowDays);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where to Watch</CardTitle>
        {tmdbLink && (
          <CardDescription>
            Streaming availability (US).{' '}
            <Link href={tmdbLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              View on JustWatch <LinkIcon className="h-3 w-3" />
            </Link>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Display Flatrate if available */}
          {hasFlatrate && (
            <ProviderList title="Stream" providers={providers.flatrate} type="Subscription" />
          )}

          {/* Display Estimate if no Flatrate and estimate is available */}
          {!hasFlatrate && estimate && estimatedDateStr && (
            <div className="p-4 rounded-md border border-dashed border-primary/50 bg-primary/10 text-primary-foreground">
              <h4 className="text-md text-primary/80 font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estimated Streaming
              </h4>
              <p className="text-sm text-primary/80">
                Based on the studio, this movie might arrive on <strong>{estimate.name}</strong> around <strong>{estimatedDateStr}</strong>.
              </p>
              <p className="text-xs text-primary/80 mt-1">(This is an estimate and subject to change)</p>
            </div>
          )}

          {/* Display Rent/Buy - Add check for providers */}
          <ProviderList title="Rent" providers={providers?.rent} type="Rent" />
          <ProviderList title="Buy" providers={providers?.buy} type="Buy" />

          {/* Message if nothing is available (and no estimate shown) */}
          {!hasFlatrate && !hasBuyOrRent && !(estimate && estimatedDateStr) && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Info className="h-10 w-10 mb-3" />
              <p>Streaming information not available for this region.</p>
              {tmdbLink && (
                 <Link href={tmdbLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline mt-2">
                   Check JustWatch <LinkIcon className="h-3 w-3" />
                 </Link>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
