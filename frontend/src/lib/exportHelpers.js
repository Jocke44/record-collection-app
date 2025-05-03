import { toast } from "sonner";

export function exportToCSV(records = []) {
  if (!records.length) {
    toast.error("No records to export!");
    return;
  }

  const header = Object.keys(records[0]).join(",");
  const rows = records.map((r) => Object.values(r).join(","));
  const csvContent = [header, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "record_collection.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success("✅ Collection exported!");
}

export async function downloadDatabase() {
  try {
    const response = await fetch("http://localhost:8000/download-db");
    if (!response.ok) {
      throw new Error("Failed to download database");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "records.db";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    toast.success("✅ Database downloaded!");
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to download database");
  }
}
