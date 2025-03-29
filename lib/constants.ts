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
  'a24': { name: 'Varies (Max/Prime?)', logo: '/placeholder-logo.svg', windowDays: 90 }, // Rough estimate
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
