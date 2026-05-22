import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
export async function fetchMovies(
  query: string,
  currentPage: number
): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`,
    {
      params: {
        // твої параметри
      },
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  );
  return response.data;
}