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
  gap: 2rem;
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
    margin-top: 0;
  }

  p {
    line-height: 1.4;
  }
`;

const Poster = styled.img`
  width: 180px;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  align-self: flex-start;

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0;
  }

  p {
    margin: 0.25rem 0;
  }
`;

const RatingList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;

  li {
    margin: 0.3rem 0;
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
  
      if (/^\d+(\.\d+)?\/10$/.test(value)) {
        // IMDb format e.g. "7.8/10"
        return parseFloat(value.split('/')[0]) * 10;
      }
  
      if (/^\d+\/100$/.test(value)) {
        // Metacritic format e.g. "58/100"
        return parseFloat(value.split('/')[0]);
      }
  
      if (value.endsWith('%')) {
        // Rotten Tomatoes format e.g. "93%"
        return parseFloat(value.replace('%', ''));
      }
  
      return 0;
    });
  
    if (normalizedRatings.length === 0) return 'N/A';
  
    const average =
      normalizedRatings.reduce((sum, val) => sum + val, 0) / normalizedRatings.length;
  
    return `${average.toFixed(1)}%`;
  };

  return (
    <DetailWrapper>
      <TopSection>
        {omdbData?.Poster && (
          <Poster
            src={omdbData?.Poster}
            alt={`${selectedMovie.title} Poster`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://www.prokerala.com/movies/assets/img/no-poster-available.jpg';
            }}
          />
        )}
        <MovieInfo>
          <h2>{selectedMovie.title}</h2>
          <p><strong>Director:</strong> {selectedMovie.director}</p>
          <p><strong>Producer:</strong> {selectedMovie.producer}</p>
          <p><strong>Opening Crawl:</strong> {selectedMovie.opening_crawl}</p>
        </MovieInfo>
      </TopSection>

      {omdbData && (
        <BottomSection>
          {omdbData?.Ratings?.length > 0 && (
            <>
              <h4>Ratings:</h4>
              <RatingList>
                {omdbData.Ratings.map((r) => (
                  <li key={r.Source}>{r.Source}: {r.Value}</li>
                ))}
              </RatingList>
              <p><strong>Average Rating:</strong> {getAverageRating()}</p>
            </>
          )}
        </BottomSection>
      )}
    </DetailWrapper>
  )
};

export default MovieDetails;
