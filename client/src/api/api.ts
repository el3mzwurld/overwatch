import { axiosInstance } from "./axiosInstance";

export const getFilms = (page = 1) => {
  axiosInstance
    .get("/items/films", { params: { page } })
    .then((res) => res.data);
};

export const searchFilm = (query: string, page = 1) =>
  axiosInstance
    .get("/items/films/search", { params: { query, page } })
    .then((res) => res.data);
