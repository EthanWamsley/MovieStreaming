import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- TMDb Image Helper (Moved from lib/movies.ts for client-side safety) ---
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbImageUrl(path: string | null | undefined, size: 'w500' | 'original' | 'w200' | 'w300' | 'w400' = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
// --- End TMDb Image Helper ---
