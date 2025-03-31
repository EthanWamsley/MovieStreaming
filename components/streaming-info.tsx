"use client";

import type { TmdbWatchProvidersRegion, TmdbWatchProviderDetails, TmdbMovieDetails } from "@/lib/types"; // Use TMDB types
import { getTmdbImageUrl } from "@/lib/utils"; // Import helper from utils
import { getStreamingEstimate, DISTRIBUTOR_LIST, getEstimateForDistributor } from "@/lib/constants"; // Import estimate helpers AND Distributor List
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Use Badge for type
import { Link as LinkIcon, Tv, Film, ShoppingCart, Info, Clock } from "lucide-react"; // Updated icons + Clock
import Image from "next/image";
import Link from "next/link"; // Use NextLink for external links
import { useState } from "react"; // Added useState
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select
import { Label } from "@/components/ui/label"; // Added Label

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
  const [selectedDistributor, setSelectedDistributor] = useState<string>(""); // State for dropdown
  const hasFlatrate = providers?.flatrate && providers.flatrate.length > 0;
  const hasBuyOrRent = (providers?.buy && providers.buy.length > 0) || (providers?.rent && providers.rent.length > 0);

  let estimate = null; // Estimate based on production company
  let estimatedDateStr: string | null = null;
  let distributorEstimate = null; // Estimate based on selected distributor
  let distributorEstimatedDateStr: string | null = null;

  // Calculate estimate based on production company if no flatrate
  if (!hasFlatrate && movieDetails) {
    estimate = getStreamingEstimate(movieDetails.production_companies);
    if (estimate) {
      estimatedDateStr = getEstimatedDate(movieDetails.release_date, estimate.windowDays);
    }
  }

  // Calculate estimate based on selected distributor if one is selected
  if (selectedDistributor && movieDetails) {
      distributorEstimate = getEstimateForDistributor(selectedDistributor);
      if (distributorEstimate) {
          distributorEstimatedDateStr = getEstimatedDate(movieDetails.release_date, distributorEstimate.windowDays);
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

          {/* --- Distributor Selection Dropdown (Only if no flatrate) --- */}
          {!hasFlatrate && !estimatedDateStr && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <Label htmlFor="distributor-select" className="text-sm font-medium text-muted-foreground mb-2 block">
                Help us estimate streaming availability!
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                If you know the distributor for this movie, selecting it might help predict when it will stream.
              </p>
              <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
                <SelectTrigger id="distributor-select" className="w-full md:w-[280px]">
                  <SelectValue placeholder="Select Distributor..." />
                </SelectTrigger>
                <SelectContent>
                  {DISTRIBUTOR_LIST.map((distributor) => (
                    <SelectItem key={distributor} value={distributor}>
                      {distributor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Display prediction based on selected distributor */}
              {selectedDistributor && distributorEstimate && distributorEstimatedDateStr && (
                <div className="mt-4 p-3 rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  <h5 className="text-sm font-semibold mb-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Prediction based on {selectedDistributor}
                  </h5>
                  <p className="text-xs">
                    Movies from this distributor often arrive on <strong>{distributorEstimate.name}</strong> around <strong>{distributorEstimatedDateStr}</strong>.
                  </p>
                   <p className="text-xs opacity-80 mt-1">(This is an estimate and subject to change)</p>
                </div>
              )}
               {selectedDistributor && !distributorEstimate && (
                 <p className="text-xs text-muted-foreground mt-2">
                   Selected: {selectedDistributor}. (No specific streaming estimate available for this distributor).
                 </p>
              )}
            </div>
          )}
          {/* --- End Distributor Selection --- */}


          {/* Display Rent/Buy - Add check for providers */}
          <ProviderList title="Rent" providers={providers?.rent} type="Rent" />
          <ProviderList title="Buy" providers={providers?.buy} type="Buy" />

          {/* Message if nothing is available (and no estimate shown AND no distributor dropdown shown - though dropdown always shows if no flatrate) */}
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
