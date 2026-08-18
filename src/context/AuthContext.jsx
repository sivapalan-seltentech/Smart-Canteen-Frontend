import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../utils/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "smartCanteenToken";
const USER_KEY = "smartCanteenUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CLEAR SESSION
  // =====================================================

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);

    window.dispatchEvent(new Event("userLogout"));
  };

  // =====================================================
  // RESTORE LOGIN SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const result = await api.getCurrentUser();

        const loggedUser = result?.user || result;

        console.log("AUTH /ME USER:", loggedUser);

        if (mounted) {
          setUser(loggedUser || null);

          if (loggedUser) {
            localStorage.setItem(
              USER_KEY,
              JSON.stringify(loggedUser)
            );
          }

          window.dispatchEvent(new Event("userLogin"));
        }
      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );

        clearSession();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    const onExpired = () => {
      clearSession();
    };

    window.addEventListener(
      "authExpired",
      onExpired
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "authExpired",
        onExpired
      );
    };
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (identifier, password) => {
    const result = await api.login(
      identifier,
      password
    );

    const token = result?.token;

    if (!token) {
      throw new Error(
        "Login succeeded but token was not returned."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      token
    );

    /*
     * Login response user.
     */
    let loggedUser = result?.user || null;

    /*
     * If login response doesn't contain complete
     * student details, get latest user from /auth/me.
     */
    try {
      const currentUser = await api.getCurrentUser();

      loggedUser =
        currentUser?.user ||
        currentUser ||
        loggedUser;
    } catch (error) {
      console.warn(
        "Unable to fetch current user after login:",
        error
      );
    }

    console.log(
      "LOGIN USER:",
      loggedUser
    );

    setUser(loggedUser);

    if (loggedUser) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedUser)
      );
    }

    window.dispatchEvent(
      new Event("userLogin")
    );

    return {
      ...result,
      user: loggedUser,
    };
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      if (
        localStorage.getItem(TOKEN_KEY)
      ) {
        await api.logout();
      }
    } catch (error) {
      console.warn(
        "Logout request failed:",
        error
      );
    } finally {
      clearSession();
    }
  };

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isLoggedIn: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =======================================================
// USE AUTH
// =======================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}