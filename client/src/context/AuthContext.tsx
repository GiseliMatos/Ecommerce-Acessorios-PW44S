import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<any>;
  handleLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const token = JSON.parse(storedToken);
        const user = JSON.parse(storedUser);
        
        setAuthenticatedUser(user);
        setAuthenticated(true);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
      }
    }
  }, []);

  const handleLogin = async (
    authenticationResponse: AuthenticationResponse
  ) => {
    try {
      localStorage.setItem(
        "token",
        JSON.stringify(authenticationResponse.token)
      );
      localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authenticationResponse.token}`;

      setAuthenticatedUser(authenticationResponse.user);
      setAuthenticated(true);
    } catch {
      setAuthenticatedUser(undefined);
      setAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];

    setAuthenticated(false);
    setAuthenticatedUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
