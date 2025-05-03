import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const { login, isAuthenticated  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ fix

  const emailRef = useRef(); // ✅ fix

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/collection");
    }
  }, [isAuthenticated]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner
    try {
      await login(email, password);
      navigate(location.state?.from || "/collection");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-4 space-y-1">
          <div>
            <Link to="/request-password-reset" className="hover:underline text-blue-500">
              Forgot password?
            </Link>
          </div>
          <div>
            <Link to="/reset-password" className="hover:underline text-blue-500 text-xs">
              Already have a token?
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}


