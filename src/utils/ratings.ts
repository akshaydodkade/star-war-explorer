export interface OMDbRating {
  Source: string;
  Value: string;
}

export interface OMDbData {
  Ratings?: OMDbRating[];
}

export const getAverageRatingFromOMDbData = (omdbData?: OMDbData): number | 'N/A' => {
  if (!omdbData?.Ratings?.length) return 'N/A';

  const normalizedRatings = omdbData.Ratings.map((r) => {
    const value = r.Value.trim();

    if (/^\d+(\.\d+)?\/10$/.test(value)) return parseFloat(value.split('/')[0]);
    if (/^\d+\/100$/.test(value)) return parseFloat(value.split('/')[0]) / 10;
    if (value.endsWith('%')) return parseFloat(value.replace('%', '')) / 10;

    return 0;
  });

  if (normalizedRatings.length === 0) return 'N/A';

  const avg = normalizedRatings.reduce((a, b) => a + b, 0) / normalizedRatings.length;
  return parseFloat(avg.toFixed(1));
};
