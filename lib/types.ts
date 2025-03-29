export interface Movie {
  id: string
  title: string
  tagline: string
  overview: string
  releaseYear: number
  runtime: number
  rating: number
  posterUrl: string
  backdropUrl: string
  genres: string[]
  director: string
  writers: string[]
  stars: string[]
  streaming: StreamingService[]
}

export interface StreamingService {
  name: string
  logoUrl: string
  subscription: boolean
  rentalPrice?: number
  availableDate: string | null
}

// TMDb API Types
export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  tagline: string | null;
  overview: string | null;
  release_date: string; // YYYY-MM-DD
  runtime: number | null;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: TmdbGenre[];
  production_companies: TmdbProductionCompany[];
  budget: number; // Added budget
  revenue: number; // Added revenue
  // Add other fields as needed
}

// Added Production Company type
export interface TmdbProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TmdbWatchProviderDetails {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TmdbWatchProvidersRegion {
  link: string;
  flatrate?: TmdbWatchProviderDetails[];
  rent?: TmdbWatchProviderDetails[];
  buy?: TmdbWatchProviderDetails[];
}

export interface TmdbWatchProvidersResponse {
  id: number;
  results: {
    [regionCode: string]: TmdbWatchProvidersRegion;
  };
}

// TMDb Search Result Types
export interface TmdbMovieSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string; // YYYY-MM-DD
  overview: string | null;
  vote_average: number;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovieSearchResult[];
  total_pages: number;
  total_results: number;
}
