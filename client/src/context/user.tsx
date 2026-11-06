import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { LoginResponse, User } from "../assets/lib/types";
import { axiosInstance } from "../api/axiosInstance";
import { deleteToken, getToken, setToken } from "../assets/lib/utils";
import axios from "axios";

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    username: string,
    password: string,
  ) => Promise<AuthResponse>;
  logout: () => void;
  isSubmitting: boolean;
  error?: string;
  getCurrentProfile: () => void;
  isInitializing: boolean;
};

type AuthResponse = {
  success: boolean;
  cause?: string;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    console.error(
      "Caution: The useUser hook must be used within it's corresponding UserProvider",
    );
  }

  return context;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isInitializing, setIsInitializing] = useState(() => !!getToken());

  async function login(email: string, password: string): Promise<AuthResponse> {
    setIsSubmitting(true);
    setError(undefined);
    const body = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post("/auth/login", body);
      const data: LoginResponse = await response.data;
      setToken(data.token);
      setError(undefined);
      return {
        success: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Invalid user details");
          return { success: false, cause: "Invalid user details" };
        }
      }
      const message =
        "We were unable to authenticate you. It's a problem we're trying to solve.";
      setError(message);
      return {
        success: false,
        cause: message,
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signUp(
    email: string,
    username: string,
    password: string,
  ): Promise<AuthResponse> {
    setIsSubmitting(true);
    setError(undefined);
    const body = {
      email,
      userName: username,
      password,
    };

    try {
      await axiosInstance.post("/auth/reg", body);

      setError(undefined);
      return {
        success: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          const message = "This email is already assigned to another user.";
          setError(message);
          return { success: false, cause: message };
        }
      }
      const message =
        "We were unable to authenticate you. It's a problem we're trying to solve.";
      setError(message);
      return {
        success: false,
        cause: message,
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  const getCurrentProfile = async () => {
    const tok = getToken();
    if (!tok) {
      setUser(null);
      setIsInitializing(false);
      return;
    }
    console.log(typeof tok);
    setIsInitializing(true);
    try {
      const response = await axiosInstance.get("/auth/me");
      const userData = response.data;
      setUser(userData.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log("not authorized from backend");
          setError("Unable to authenticate.");
          setUser(null);
          deleteToken();
        } else {
          setError("Server Error : There seems to be an issue on our end");
          console.error(error.message, error.cause);
        }
        return;
      }
      setError("Server Error");
      console.error((error as Error).message);
    } finally {
      setIsInitializing(false);
    }
  };

  function logout() {
    setUser(null);
    setIsInitializing(false);
    deleteToken();
  }

  useEffect(() => {
    getCurrentProfile();

    const syncLogout = (event: StorageEvent) => {
      if (event.key === "token" && !event.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <UserContext.Provider
      value={{
        login,
        signUp,
        getCurrentProfile,
        logout,
        isInitializing,
        error,
        user,
        isSubmitting,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
