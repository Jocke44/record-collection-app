// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(location.state?.token || "");
  const [email, setEmail] = useState(() => location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isWeak = password.length < 8;

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }

    if (isWeak) {
      return toast.warning("Password should be at least 8 characters");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/reset-password/confirm", {
        token,
        new_password: password,
      });
      toast.success("Password reset! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error("Reset failed. Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Reset Password</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white pr-10"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white pr-10"
              required
            />
            <span
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {isWeak && password && (
            <p className="text-yellow-500 text-sm">Password too short</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "🔄 Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}



