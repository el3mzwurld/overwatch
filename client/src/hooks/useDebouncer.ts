import { useEffect, useState } from "react";

// debouncer hook for search bar
export function useDebouncer<T>(value: T, delay = 400) {
  const [deb, setDeb] = useState(value);

  // useEffect hook that will run, and only change the value until after the delay expires, by default set to 0.4s
  useEffect(() => {
    const timeout = setTimeout(() => setDeb(value), delay);

    return () => clearTimeout(timeout); //if the value changes before the timer runs out, remove it and start another
  }, [value, delay]);

  return deb;
}
