import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ add
  const emailRef = useRef(); // ✅ add

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/collection");
    }
  }, [isAuthenticated]);
  

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true); // Start spinner
    try {
      await register(email, password);
      navigate("/collection");
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Register</h1>

        <form onSubmit={handleRegister} className="space-y-4">
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "🔄 Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          <Link to="/login" className="hover:underline text-blue-500">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}


