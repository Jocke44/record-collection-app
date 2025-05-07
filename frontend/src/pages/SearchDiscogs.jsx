// src/pages/SearchDiscogs.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScannerModal } from "@/components/ScannerModal";
import { searchDiscogs, addRecord } from "@/lib/api";

export default function SearchDiscogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const data = await searchDiscogs(searchTerm);
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
      toast.error("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (item) => {
    try {
      await addRecord(item);
      toast.success("✅ Added to collection!");
    } catch (err) {
      console.error("Failed to add", err);
      toast.error("❌ Failed to add to collection");
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="space-y-4"
      >
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search artist, album, or scan barcode..."
        />
        <div className="flex gap-2">
          <Button type="submit">Search</Button>
          <Button variant="outline" onClick={() => setScannerOpen(true)}>
            Scan Barcode
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
          {results.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="font-bold text-lg truncate">{item.title}</div>
              <div className="text-sm text-muted-foreground mb-2 truncate">
                {item.format} | {item.genre} | {item.label}
              </div>
              <img
                src={item.cover_url}
                alt={item.title}
                className="h-40 w-full object-cover rounded-lg mt-2 hover:scale-105 transition-transform"
              />
              <Button className="mt-4 w-full" onClick={() => handleAdd(item)}>
                ➕ Add to Collection
              </Button>
            </div>
          ))}
        </div>
      </form>

      {scannerOpen && (
        <ScannerModal
          onDetected={(code) => setSearchTerm(code)}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </>
  );
}

             

