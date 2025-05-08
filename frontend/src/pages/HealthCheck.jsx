// src/pages/HealthCheck.jsx
import { useEffect } from "react";
import { getRecords } from "@/lib/api";

export default function HealthCheck() {
  useEffect(() => {
    getRecords()
      .then(() => {
        const el = document.getElementById("api-status");
        if (el) el.textContent = "✅ OK";
      })
      .catch(() => {
        const el = document.getElementById("api-status");
        if (el) el.textContent = "❌ Error";
      });
  }, []);

  return (
    <div className="text-sm text-muted-foreground">
      <p>Frontend is working ✅</p>
      <p>Backend reachable: <span id="api-status">loading...</span></p>
    </div>
  );
}

