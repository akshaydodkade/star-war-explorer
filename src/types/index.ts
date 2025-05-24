export interface Movie {
  title: string;
  episode_id: number;
  release_date: string;
  director: string;
  producer: string;
  opening_crawl: string;
  averageRating?: number | null;
}

export interface OMDbData {
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
}