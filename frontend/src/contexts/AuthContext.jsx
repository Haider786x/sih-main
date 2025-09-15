import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = "https://sih-besy.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [loading, setLoading] = useState(true);

  // Attach/remove Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          // restore role from storage
          const storedRole = localStorage.getItem("userRole");
          if (storedRole) setUserRole(storedRole);
        } catch (err) {
          console.error(
            "Auth check failed:",
            err.response?.data || err.message
          );
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, role } = res.data;
      setToken(newToken);
      setUserRole(role);

      localStorage.setItem("token", newToken);
      localStorage.setItem("userRole", role);

      // Fetch profile after login
      const profileRes = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUser(profileRes.data);

      return { success: true, role };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  // Register
  const register = async (username, email, password, role) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        role,
      });

      // Unlike login, register doesn’t auto-login in your backend
      return { success: true, role: res.data.role };
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Profile update failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userRole,
        login,
        register,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
