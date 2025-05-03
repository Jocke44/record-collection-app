import { useEffect } from "react";

export default function HealthCheck() {
  useEffect(() => {
    fetch("http://localhost:8000/records")
      .then((r) => {
        const el = document.getElementById("api-status");
        if (el) el.textContent = r.ok ? "✅ OK" : "❌ Fail";
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
