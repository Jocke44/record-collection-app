// src/pages/MyCollection.jsx
import { useEffect, useState } from "react";
import { getRecords } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import RecordCard from "@/components/RecordCard";
import RecordModal from "@/components/RecordModal";

export default function MyCollection() {
  const [records, setRecords] = useState([]);
  const [sortBy, setSortBy] = useState(localStorage.getItem("sortBy") || "artist");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);




  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await getRecords();
        setRecords(res || []);
      } catch (err) {
        toast.error("Failed to load records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const grouped = records.reduce((acc, rec) => {
    const key = (rec.artist || "Unknown").trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(rec);
    return acc;
  }, {});

  const sortedGrouped = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              localStorage.setItem("sortBy", e.target.value);
            }}
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-zinc-800 dark:text-white"
          >
            <option value="artist">Artist</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="genre">Genre</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <p>No records in your collection.</p>
      ) : (
        sortedGrouped.map(([groupName, groupRecords]) => {
          const sorted = [...groupRecords].sort((a, b) => {
            if (sortBy === "year") {
              return (a.year || 0) - (b.year || 0);
            }
            return (a[sortBy] || "").localeCompare(b[sortBy] || "");
          });

          return (
            <div key={groupName} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{groupName}</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sorted.map((record) => (
                  <RecordCard 
                    key={record.id} 
                    record={record} 
                    onClick={() => setSelectedRecord(record)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
      {selectedRecord && (
              <RecordModal
                record={selectedRecord}
                onClose={() => setSelectedRecord(null)}
  />
)}
    </div>
  );
}
