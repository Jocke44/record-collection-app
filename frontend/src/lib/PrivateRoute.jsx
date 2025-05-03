import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Optional spinner can go here

  return isAuthenticated ? children : <Navigate to="/login" />;
}


// This component checks if the user is authenticated. If not, it redirects to the login page. Otherwise, it renders the children components.