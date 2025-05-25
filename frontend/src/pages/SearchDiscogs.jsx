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
      setResults(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) toast.error("Unexpected response format.");
    } catch (error) {
      console.error("Search failed", error);
      toast.error("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (item) => {
    try {
      const recordData = {
        title: item.title,
        artist: item.artist,
        year: item.year,
        genre: item.genre,
        label: item.label,
        format: item.format,
        tracklist: item.tracklist?.map(track => track.title) || [],
      };
      await addRecord(recordData);
      toast.success("Record added!");
    } catch (error) {
      console.error("Add record failed", error);
      toast.error("Failed to add record to collection.");
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

        {results.length === 0 && !loading && (
          <div className="text-center text-muted-foreground mt-6">No results.</div>
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
