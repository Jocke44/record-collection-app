// src/pages/HealthCheck.jsx
import { useEffect, useState } from "react";
import { getRecords } from "@/lib/api";

export default function HealthCheck() {
  const [apiStatus, setApiStatus] = useState("loading...");

  useEffect(() => {
    getRecords()
      .then(() => setApiStatus("✅ OK"))
      .catch(() => setApiStatus("❌ Error"));
  }, []);

  return (
    <div className="text-sm text-muted-foreground">
      <p>Frontend is working ✅</p>
      <p>Backend reachable: <span>{apiStatus}</span></p>
    </div>
  );
}


