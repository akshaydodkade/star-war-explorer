import axios from 'axios';

const SWAPI_BASE = 'https://swapi.py4e.com/api/films/?format=json';
const OMDB_BASE = 'https://www.omdbapi.com/';
const OMDB_KEY = 'b9a5e69d'; // NOTE: for security reasons, it should get store in .env

export const fetchMovies = () => axios.get(SWAPI_BASE);

export const fetchOMDbData = (title: string) =>
  axios.get(`${OMDB_BASE}?t=${title}&apikey=${OMDB_KEY}`);