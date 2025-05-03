// src/pages/RequestPasswordReset.jsx


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function RequestPasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/request-password-reset", null, {
        params: { email },
      });

      toast.success("Reset token generated! Redirecting...");
      navigate("/reset-password", {
        state: { token: res.data.token, email }, // ✅ pass token to reset page
      });
    } catch (err) {
      toast.error("Could not send reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Request Password Reset</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

