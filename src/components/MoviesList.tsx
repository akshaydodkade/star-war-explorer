import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import styled from 'styled-components';
import { getMovies, selectMovie } from '../redux/movieSlice';
import { format } from 'date-fns';
import { getAverageRatingFromOMDbData } from '../utils/ratings';

const ListWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 80vh;
  width: 100%;
  max-width: 400px;
  min-width: 250px;
  border-right: 1px solid #bdbdbd;

  @media (max-width: 768px) {
    max-width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid #bdbdbd;
    max-height: none;
  }
`;

const MovieCard = styled.div<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? '#dfefff' : 'white')};
  border: 2px solid ${({ selected }) => (selected ? '#4a90e2' : '#f0f0f0')};
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &:hover {
    background: #e8f0fe;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #333;
  }

  p {
    margin: 0.3rem 0;
    color: #555;
    font-size: 0.9rem;
  }
`;

const NoResultsMessage = styled.p`
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  color: #777;
`;

const MoviesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, search, sortBy, selectedMovie, omdbDataMap } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  const sorted = [...movies]
    .filter((f) => f.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'year') {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      }

      if (sortBy === 'rating') {
        const aRating = getAverageRatingFromOMDbData(omdbDataMap[a.title]);
        const bRating = getAverageRatingFromOMDbData(omdbDataMap[b.title]);

        const aScore = aRating === 'N/A' ? -1 : aRating;
        const bScore = bRating === 'N/A' ? -1 : bRating;

        return bScore - aScore;
      }

      return a.episode_id - b.episode_id;
    });
  
  console.log('sorted -->');
  console.log(sorted);
    
  return (
    <ListWrapper>
      {sorted.length > 0 ? (
        sorted.map((movie) => {
          const formattedDate = format(new Date(movie.release_date), 'dd/MM/yyyy');
          return (
            <MovieCard
              key={movie.episode_id}
              onClick={() => dispatch(selectMovie(movie))}
              selected={selectedMovie?.episode_id === movie.episode_id}
            >
              <h3>{movie.title}</h3>
              <p><strong>Episode:</strong> {movie.episode_id}</p>
              <p><strong>Director:</strong> {movie.director}</p>
              <p><strong>Release:</strong> {formattedDate}</p>
            </MovieCard>
          );
        })
      ) : (
        <NoResultsMessage>No movies found.</NoResultsMessage>
      )}
    </ListWrapper>
  );
};

export default MoviesList;