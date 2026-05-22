import  SearchBar  from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { fetchMovies } from "../../services/movieService";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import toast from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
const Paginate = (ReactPaginate as any).default || ReactPaginate;
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMovie(null);
  };
  const onSelect = (movie: Movie) => {
    setMovie(movie);
    openModal();
  };

  const handleMovie = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleMovie} />
      {isSuccess && data.total_pages > 1 && (
        <Paginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={onSelect} />
      )}
      {isModalOpen && movie && (
        <MovieModal onClose={closeModal} movie={movie} />
      )}
    </div>
  );
}