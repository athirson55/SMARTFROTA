import { createContext, useContext, useMemo, useState } from "react";
import {
  clearAuthSession,
  isAuthenticated,
  persistAuthSession,
} from "../services/sessionAuth";

const defaultUser = {
  id: "USR-001",
  name: "Harsh Vani",
  role: "Operations Manager",
  email: "harsh.vani@smartfrota.com",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    isAuthenticated() ? defaultUser : null,
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: ({ keepConnected = false, profile = defaultUser } = {}) => {
        persistAuthSession(keepConnected);
        setUser(profile);
      },
      logout: () => {
        clearAuthSession();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
