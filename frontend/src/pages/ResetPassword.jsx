// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { confirmPasswordReset } from "@/lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(location.state?.token || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const isWeak = password.length < 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (isWeak) {
      toast.warning("Password should be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(token, password);  // ✅ USING THE IMPORTED API CALL
      toast.success("Password reset! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Reset failed. Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
            disabled={!!location.state?.token}
          />
          
          {location.state?.token && (
            <p className="text-sm text-gray-500">
              The token was autofilled from the reset link.
              </p>
          )}  

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />
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



