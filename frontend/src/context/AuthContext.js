import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const userId = JSON.parse(atob(token.split(".")[1])?.id);
          if (userId) {
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            setUser(response.data);
          }
        }
      } catch (err) {
        console.error("Hitelesítési hiba:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/users");
      const user = response.data.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        const token = btoa(JSON.stringify({ id: user.id, email: user.email }));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        return true;
      } else {
        setError("Hibás email cím vagy jelszó");
        return false;
      }
    } catch (err) {
      setError("Bejelentkezési hiba történt");
      return false;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:8000/users", userData);
      return response.data;
    } catch (err) {
      setError("Regisztrációs hiba történt");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Hozzáadva a setUser exportálása
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;