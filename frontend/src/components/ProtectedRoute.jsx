import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthenticated(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await api.post("/auth/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpired = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpired < now) {
      await refreshToken();
    } else {
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
