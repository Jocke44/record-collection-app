import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MyCollection from "@/pages/MyCollection";
import SearchDiscogs from "@/pages/SearchDiscogs";
import HealthCheck from "@/pages/HealthCheck";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";




export function App() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <MainLayout theme={theme} setTheme={setTheme} />
      </Router>
    </AuthProvider>
  );
}

// ✅ New extracted MainLayout component
function MainLayout({ theme, setTheme }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white p-4">
      <Toaster richColors position="top-center" theme={theme} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🎵 Record Collection</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))} variant="ghost" size="icon">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>

      <nav className="flex justify-center gap-6 mb-4 text-sm font-medium">
        {isAuthenticated ? (
          <>
            <Link to="/collection" className="hover:underline">My Collection</Link>
            <Link to="/search" className="hover:underline">Search Discogs</Link>
            <Link to="/health" className="hover:underline">Health</Link>
            <button
              onClick={logout}
              className="hover:underline text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/collection" />} />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
            <MyCollection />
          </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
            <SearchDiscogs />
            </ProtectedRoute>
          } 
        />
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
      </Routes>
    </div>
  );
}


export default App();
