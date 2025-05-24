import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import styled from 'styled-components';
import { getMovies, selectMovie, setSearch, setSortBy } from '../redux/movieSlice';
import { format } from 'date-fns';
import { getAverageRatingFromOMDbData } from '../utils/ratings';
import { Movie } from '../types';

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
    display: none;
  }
`;

const MobileSelector = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    padding: 1rem;
    background: #f9f9f9;
    border-bottom: 1px solid #ccc;

    button {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      text-align: left;
      cursor: pointer;
    }
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

const FullScreenPopup = styled.div`
  @media (min-width: 769px) {
    display: none;
  }

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 999;
  padding: 1rem;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const FilterWrapper = styled.div`
  margin: 1rem 0;

  input,
  select {
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const MoviesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, search, sortBy, selectedMovie, omdbDataMap } = useSelector((state: RootState) => state.movies);
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    dispatch(getMovies());
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handleMovieSelect = (movie: Movie) => {
    dispatch(selectMovie(movie));
    setShowPopup(false);
  };
    
  return (
    <>
      {/* Mobile Dropdown Button */}
      {isMobile && (
        <MobileSelector>
          <button onClick={() => setShowPopup(true)}>
            {selectedMovie?.title || 'Select a Movie'}
          </button>
        </MobileSelector>
      )}

      {/* Mobile Fullscreen Popup */}
      {showPopup && (
        <FullScreenPopup>
          <CloseButton onClick={() => setShowPopup(false)} aria-label="Close popup">✕</CloseButton>
          <h2>Select a Movie</h2>

          <FilterWrapper>
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
            <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value as 'episode' | 'year' | 'rating'))}>
              <option value="episode">Sort by Episode</option>
              <option value="year">Sort by Year</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </FilterWrapper>

          {sorted.map((movie) => {
            const formattedDate = format(new Date(movie.release_date), 'dd/MM/yyyy');
            return (
              <MovieCard
                key={movie.episode_id}
                onClick={() => handleMovieSelect(movie)}
                selected={selectedMovie?.episode_id === movie.episode_id}
              >
                <h3>{movie.title}</h3>
                <p><strong>Episode:</strong> {movie.episode_id}</p>
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Release:</strong> {formattedDate}</p>
              </MovieCard>
            );
          })}
        </FullScreenPopup>
      )}

      {/* Card List for Desktop */}
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
    </>
  );
};

export default MoviesList;