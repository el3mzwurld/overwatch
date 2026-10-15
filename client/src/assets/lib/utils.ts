// this is for utility functions
const tok_store = import.meta.env.LOCAL_TOKEN_STORAGE;

export const setToken = (token: string) => {
  localStorage.setItem(tok_store, JSON.stringify(token));
};

export const getToken = (): string | null => {
  return localStorage.getItem(tok_store);
};

export const deleteToken = () => {
  localStorage.removeItem(tok_store);
};

export const paginator = <T>(
  arr: Array<T>,
  page: number,
  limit: number,
): Array<T> => {
  const totalItems = arr.length;

  const end = Math.min(page * limit, totalItems);

  return arr.slice(0, end);
};

export const DISCOVERY_PAGE_LIMIT = 12;
