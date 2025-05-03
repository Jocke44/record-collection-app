
export function exportToCSV(records = []) {
  if (!records.length) return;

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
}
