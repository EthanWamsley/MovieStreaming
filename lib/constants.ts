// Estimated streaming windows and platforms for major studios
// Note: These are general estimates and can vary significantly.
// Studio names should be lowercase for easier matching.

interface StudioEstimate {
  name: string; // Display name for the platform
  logo?: string; // Optional: Path or URL to a logo (using placeholder for now)
  windowDays: number; // Estimated days from theatrical release
}

export const STUDIO_STREAMING_ESTIMATES: Record<string, StudioEstimate> = {
  // Disney / Fox
  'walt disney pictures': { name: 'Disney+', logo: '/placeholder-logo.svg', windowDays: 60 },
  'pixar': { name: 'Disney+', logo: '/placeholder-logo.svg', windowDays: 60 },
  'marvel studios': { name: 'Disney+', logo: '/placeholder-logo.svg', windowDays: 60 },
  'lucasfilm ltd.': { name: 'Disney+', logo: '/placeholder-logo.svg', windowDays: 60 },
  'searchlight pictures': { name: 'Hulu', logo: '/placeholder-logo.svg', windowDays: 75 }, // Often Hulu first
  '20th century studios': { name: 'Hulu/Max', logo: '/placeholder-logo.svg', windowDays: 75 }, // Can vary

  // Warner Bros.
  'warner bros. pictures': { name: 'Max', logo: '/placeholder-logo.svg', windowDays: 75 },
  'new line cinema': { name: 'Max', logo: '/placeholder-logo.svg', windowDays: 75 },
  'dc films': { name: 'Max', logo: '/placeholder-logo.svg', windowDays: 75 }, // Usually Max
  'dc studios': { name: 'Max', logo: '/placeholder-logo.svg', windowDays: 75 },

  // Universal
  'universal pictures': { name: 'Peacock', logo: '/placeholder-logo.svg', windowDays: 45 },
  'illumination': { name: 'Peacock', logo: '/placeholder-logo.svg', windowDays: 45 }, // Then Netflix later
  'focus features': { name: 'Peacock', logo: '/placeholder-logo.svg', windowDays: 45 },

  // Paramount
  'paramount': { name: 'Paramount+', logo: '/placeholder-logo.svg', windowDays: 45 },

  // Sony
  'columbia pictures': { name: 'Netflix', logo: '/placeholder-logo.svg', windowDays: 120 }, // Typically longer window to Netflix
  'sony pictures entertainment (spe)': { name: 'Netflix', logo: '/placeholder-logo.svg', windowDays: 120 },
  'screen gems': { name: 'Netflix', logo: '/placeholder-logo.svg', windowDays: 120 },

  // Lionsgate
  'lionsgate': { name: 'STARZ/Peacock', logo: '/placeholder-logo.svg', windowDays: 180 }, // Complex deals, often longer

  // A24 - Often varies, sometimes Prime Video, Max, or Showtime/Paramount+
  'a24': { name: 'Max/Prime', logo: '/placeholder-logo.svg', windowDays: 110 }, // Rough estimate
};

// Helper function to find the best estimate based on production companies
import type { TmdbProductionCompany } from './types';

export function getStreamingEstimate(companies: TmdbProductionCompany[]): StudioEstimate | null {
  if (!companies) return null;
  for (const company of companies) {
    const companyNameLower = company.name.toLowerCase();
    if (STUDIO_STREAMING_ESTIMATES[companyNameLower]) {
      return STUDIO_STREAMING_ESTIMATES[companyNameLower];
    }
  }
  // Could add more fuzzy matching or checks for parent companies if needed
  return null;
}

// List of common distributors for manual selection
// This list can be expanded based on common distributors seen in the market.
export const DISTRIBUTOR_LIST: string[] = [
  "A24",
  "Warner Bros. / New Line", // Combined
  "Disney / 20th Century / Searchlight", // Combined for simplicity
  "Sony Pictures / Columbia / Screen Gems", // Combined

  "Bleecker Street",
  "Briarcliff Entertainment",
  "Focus Features", // Part of Universal
  "IFC Films",
  "Lionsgate",
  "Magnolia Pictures",
  "Neon",
  "Open Road Films",
  "Paramount Pictures",
  "Roadside Attractions",
  "Universal Pictures",
  "Well Go USA Entertainment",
  // Add more as needed
  "Other / Independent",
];

// Helper function to map a selected distributor name to a streaming estimate
// This requires some interpretation as distributor names might cover multiple studios.
export function getEstimateForDistributor(distributorName: string): StudioEstimate | null {
  const lowerName = distributorName.toLowerCase();

  // Simple mapping based on keywords in the DISTRIBUTOR_LIST names
  if (lowerName.includes('disney') || lowerName.includes('20th century') || lowerName.includes('searchlight')) {
    // Prioritize Searchlight/20th Century estimate if present, otherwise Disney main
    return STUDIO_STREAMING_ESTIMATES['searchlight pictures'] ?? STUDIO_STREAMING_ESTIMATES['20th century studios'] ?? STUDIO_STREAMING_ESTIMATES['walt disney pictures'] ?? null;
  }
  if (lowerName.includes('warner') || lowerName.includes('new line')) {
    return STUDIO_STREAMING_ESTIMATES['warner bros. pictures'] ?? null;
  }
  if (lowerName.includes('universal') || lowerName.includes('focus features')) {
    // Prioritize Focus Features if name matches, otherwise Universal main
    return lowerName.includes('focus features') ? STUDIO_STREAMING_ESTIMATES['focus features'] : STUDIO_STREAMING_ESTIMATES['universal pictures'] ?? null;
  }
  if (lowerName.includes('paramount')) {
    return STUDIO_STREAMING_ESTIMATES['paramount'] ?? null;
  }
  if (lowerName.includes('sony') || lowerName.includes('columbia') || lowerName.includes('screen gems')) {
    return STUDIO_STREAMING_ESTIMATES['columbia pictures'] ?? null; // Use Columbia as the primary Sony estimate key
  }
  if (lowerName.includes('lionsgate')) {
    return STUDIO_STREAMING_ESTIMATES['lionsgate'] ?? null;
  }
  if (lowerName.includes('a24')) {
    return STUDIO_STREAMING_ESTIMATES['a24'] ?? null;
  }
  // Add more mappings for other distributors if estimates exist or make sense
  // e.g., Amazon, Apple often have their own platforms immediately or shortly after release.

  // Default case if no specific mapping found
  return null;
}
