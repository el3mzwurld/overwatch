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
  login: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    username: string,
    password: string,
  ) => Promise<AuthResponse>;
  user: User | null;
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
  const [isInitializing, setIsInitializing] = useState(false);
  async function login(email: string, password: string): Promise<AuthResponse> {
    setIsSubmitting(true);
    const body = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post("/auth/login", body);
      const data: LoginResponse = await response.data;
      setUser(data.user);
      setToken(data.token);

      return {
        success: true,
      };
    } catch (error) {
      setError((error as Error).message);
      return {
        success: false,
        cause: (error as Error).message,
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
    const body = {
      email,
      userName: username,
      password,
    };

    try {
      await axiosInstance.post("/auth/reg", body);

      return {
        success: true,
      };
    } catch (error) {
      setError((error as Error).message);
      return {
        success: false,
        cause: (error as Error).message,
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  const getCurrentProfile = useCallback(async () => {
    const tok = getToken();
    if (!tok) {
      logout();
      return;
    }

    setIsInitializing(true);
    try {
      const response = await axiosInstance.get("/auth/me");
      const userData = response.data;
      setUser(userData.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          deleteToken();
          setUser(null);
        } else if (error.status === 500) {
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
  }, []);

  function logout() {
    setUser(null);
    setIsLoading(false);
    deleteToken();
  }

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

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
