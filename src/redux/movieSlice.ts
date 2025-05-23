import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMovies, fetchOMDbData } from '../api/moviesApi';
import { Movie, OMDbData } from '../types';

interface MovieState {
  movies: Movie[];
  selectedMovie: Movie | null;
  omdbData: OMDbData | null;
  search: string;
  sortBy: 'year' | 'episode' | 'rating';
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  omdbData: null,
  search: '',
  sortBy: 'episode',
  status: 'idle',
}

export const getMovies = createAsyncThunk('movies/get', async () => {
  const response = await fetchMovies();
  return response?.data?.results;
})

export const getOMDbData = createAsyncThunk('movies/omdb', async (title: string) => {
  const response = await fetchOMDbData(title);
  return response?.data;
})

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    selectMovie(state, action) {
      state.selectedMovie = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.status = 'idle';
      })
      .addCase(getOMDbData.fulfilled, (state, action) => {
        state.omdbData = action.payload;
      })
  },
});

export const { selectMovie, setSearch, setSortBy } = moviesSlice.actions;
export default moviesSlice.reducer;
