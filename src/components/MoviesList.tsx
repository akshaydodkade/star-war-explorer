import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import styled from 'styled-components';
import { getMovies, selectMovie } from '../redux/movieSlice';

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

const MovieCard = styled.div`
  background: white;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background 0.2s ease;

  &:hover {
    background: #e8f0fe;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
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
  const { movies, search, sortBy } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  const sorted = [...movies]
    .filter((f) => f.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'year' ? a.release_date.localeCompare(b.release_date) : a.episode_id - b.episode_id);
    
  return (
    <ListWrapper>
      {sorted?.length > 0
        ? sorted?.map((movie) => (
          <MovieCard key={movie.episode_id} onClick={() => dispatch(selectMovie(movie))}>
            {movie.title} ({(movie.release_date)})
          </MovieCard>
        ))
        : (
          <NoResultsMessage>No movies found.</NoResultsMessage>
        )
      }
    </ListWrapper>
  );
};

export default MoviesList;