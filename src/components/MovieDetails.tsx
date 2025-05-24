import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getOMDbData } from '../redux/movieSlice';
import styled from 'styled-components';

const DetailWrapper = styled.div`
  flex: 2;
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  h2 {
    margin: 0 0 1rem;
    font-size: 1.6rem;
    color: #222;
  }

  p {
    line-height: 1.5;
    margin: 0.3rem 0;
    color: #444;
  }

  strong {
    color: #222;
  }
`;

const Poster = styled.img`
  width: 180px;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  align-self: flex-start;
  border: 1px solid #ccc;

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    color: #333;
  }

  p {
    margin: 0.5rem 0;
    color: #555;
  }
`;

const RatingList = styled.ul`
  padding: 0;
  margin: 0 0 0.5rem;
  list-style-type: none;

  li {
    margin: 0.3rem 0;
    color: #555;
  }

  span {
    font-weight: bold;
  }
`;

const MovieDetails = () => {
  const { selectedMovie, omdbData } = useSelector((state: RootState) => state.movies);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedMovie) dispatch(getOMDbData(selectedMovie.title));
  }, [selectedMovie, dispatch]);

  if (!selectedMovie) return <DetailWrapper>Please select movie to view details</DetailWrapper>;

  const getAverageRating = () => {
    if (!omdbData?.Ratings?.length) return 'N/A';

    const normalizedRatings = omdbData.Ratings.map((r) => {
      const value = r.Value.trim();

      if (/^\d+(\.\d+)?\/10$/.test(value)) return parseFloat(value.split('/')[0]);
      if (/^\d+\/100$/.test(value)) return parseFloat(value.split('/')[0]) / 10;
      if (value.endsWith('%')) return parseFloat(value.replace('%', '')) / 10;

      return 0;
    });

    const avg = normalizedRatings.reduce((a, b) => a + b, 0) / normalizedRatings.length;
    return `${avg.toFixed(1)}/10`;
  };

  return (
    <DetailWrapper>
      <TopSection>
        <Poster
          src={omdbData?.Poster || 'https://www.prokerala.com/movies/assets/img/no-poster-available.jpg'}
          alt={`${selectedMovie.title} Poster`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://www.prokerala.com/movies/assets/img/no-poster-available.jpg';
          }}
        />

        <MovieInfo>
          <h2>
            Episode {selectedMovie.episode_id}: {selectedMovie.title}
          </h2>
          <p><strong>Director:</strong> {selectedMovie.director}</p>
          <p><strong>Producer:</strong> {selectedMovie.producer}</p>
          <p><strong>Opening Crawl:</strong><br /> {selectedMovie.opening_crawl}</p>
        </MovieInfo>
      </TopSection>

      {omdbData && omdbData.Ratings?.length > 0 && (
        <BottomSection>
          <h4>Ratings</h4>
          <RatingList>
            {omdbData.Ratings.map((r) => {
              let normalized = 'N/A';
              const value = r.Value.trim();
              if (/^\d+(\.\d+)?\/10$/.test(value)) normalized = `${parseFloat(value.split('/')[0]).toFixed(1)}/10`;
              if (/^\d+\/100$/.test(value)) normalized = `${(parseFloat(value.split('/')[0]) / 10).toFixed(1)}/10`;
              if (value.endsWith('%')) normalized = `${(parseFloat(value.replace('%', '')) / 10).toFixed(1)}/10`;

              return (
                <li key={r.Source}>
                  <span>{r.Source}:</span> ⭐ {normalized}
                </li>
              );
            })}
          </RatingList>
          <p><strong>Average Rating:</strong> ⭐ {getAverageRating()}</p>
        </BottomSection>
      )}
    </DetailWrapper>
  )
};

export default MovieDetails;
