import type { Film } from "../assets/lib/types";
import { axiosInstance } from "./axiosInstance";

interface DiscoverFilmReturn {
  films: Film[];
}

// film endpoints
export async function discoverFilms(): Promise<Film[]> {
  try {
    const res = await axiosInstance.get("/items/films");
    const data: DiscoverFilmReturn = res.data;
    return data.films;
  } catch (error) {
    console.log("We encountered a hitch fetching your data", error);
    throw new Error("Failed to fethc films", { cause: error });
  }
}

export async function searchFilms(query: string): Promise<Film[]> {
  try {
    const res = await axiosInstance.get("/items/films/search", {
      params: { q: query },
    });

    const data: { films: Film[] } = res.data;
    return data.films;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error("Failed to fethc films", { cause: error });
  }
}
