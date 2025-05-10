// src/pages/ResetPasswordRequest.jsx

import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/api";

export default function ResetPasswordRequest() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      toast.success("Reset token sent (check console/log)");
      
    } catch (err) {
      toast.error("Failed to send reset request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Request Password Reset</h1>
        <form onSubmit={handleRequest} className="space-y-4">
          <input
            ref={emailRef}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            required
          />
          {location.state?.email && (
            <p className="text-sm text-gray-500">
              The email was autofilled from the previous page.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "🔄 Sending..." : "Send Reset Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
