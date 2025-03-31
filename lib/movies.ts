import type { TmdbMovieDetails, TmdbWatchProvidersResponse, TmdbSearchResponse, TmdbReleaseDatesResponse } from "./types"; // Added TmdbReleaseDatesResponse

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
// const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"; // Moved to lib/utils.ts

if (!TMDB_API_KEY) {
  throw new Error("Missing TMDB_API_KEY environment variable");
}

const fetchTmdb = async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
  const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // console.log(`Fetching: ${url.toString()}`); // Uncomment for debugging

  try {
    const response = await fetch(url.toString(), {
      // Next.js caching options can be added here if needed
      // cache: 'force-cache', // Example: Cache aggressively
      // next: { revalidate: 3600 } // Example: Revalidate every hour
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Try to parse error details
      console.error("TMDb API Error:", response.status, response.statusText, errorData);
      throw new Error(`TMDb API request failed with status ${response.status}: ${errorData?.status_message || response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error("Error fetching from TMDb:", error);
    // Re-throw the error or handle it appropriately
    if (error instanceof Error) {
        throw new Error(`Failed to fetch from TMDb: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching from TMDb.");
  }
};

export async function getMovieDetails(movieId: string): Promise<TmdbMovieDetails> {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }
  return fetchTmdb<TmdbMovieDetails>(`/movie/${movieId}`);
}

export async function getMovieStreamingProviders(movieId: string): Promise<TmdbWatchProvidersResponse> {
    if (!movieId) {
        throw new Error("Movie ID is required");
    }
    // Fetches all regions, filtering can happen in the component or here
    return fetchTmdb<TmdbWatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
}

// Search for movies
export async function searchMovies(query: string, page: number = 1): Promise<TmdbSearchResponse> {
    if (!query) {
        throw new Error("Search query is required");
    }
    return fetchTmdb<TmdbSearchResponse>('/search/movie', { query: query, page: String(page) });
}

// Fetch release dates (potential source for distributor info)
export async function getMovieReleaseDates(movieId: string): Promise<TmdbReleaseDatesResponse> {
    if (!movieId) {
        throw new Error("Movie ID is required");
    }
    return fetchTmdb<TmdbReleaseDatesResponse>(`/movie/${movieId}/release_dates`);
}

// Helper function for image URLs moved to lib/utils.ts
// export function getTmdbImageUrl(...) { ... }
