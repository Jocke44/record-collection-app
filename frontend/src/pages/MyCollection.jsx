// src/pages/MyCollection.jsx
import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import { exportToCSV, downloadDatabase } from "@/lib/exportHelpers";
import {
  getRecords,
  deleteRecordById,
  addRecord,
  updateRecord,
  searchDiscogs,
} from "@/lib/api";

export default function MyCollection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [groupBy, setGroupBy] = useState("artist");
  const [sortBy, setSortBy] = useState("artist");
  const [lastDeleted, setLastDeleted] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: "",
    artist: "",
    year: "",
    genre: "",
    format: "",
    label: "",
    cover_url: "",
    barcode: "",
  });

  const loadRecords = async () => {
    try {
      const res = await getRecords();
      setRecords(res);
    } catch (err) {
      toast.error("Failed to load records!");
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      record.title.toLowerCase().includes(search) ||
      record.artist.toLowerCase().includes(search)
    );
  });

  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const key = record[groupBy] || "Unknown";
    acc[key] = acc[key] || [];
    acc[key].push(record);
    return acc;
  }, {});

  const deleteRecord = async (id) => {
    const record = records.find((r) => r.id === id);
    setLastDeleted(record);
    try {
      await deleteRecordById(id);
      setSelected(null);
      await loadRecords();
      toast.success("Record deleted", {
        action: {
          label: <Undo2 className="h-4 w-4" />,
          onClick: () => addToCollection(record),
        },
      });
    } catch (err) {
      toast.error("Failed to delete record!");
    }
  };

  const addToCollection = async (item) => {
    try {
      await addRecord(item);
      await loadRecords();
      toast.success("Record re-added!");
    } catch (err) {
      toast.error("Failed to re-add record.");
    }
  };

  const updateNotes = async () => {
    const updated = { ...selected, notes };
    try {
      await updateRecord(selected.id, updated);
      setSelected(null);
      await loadRecords();
      toast.success("Notes updated!");
    } catch (err) {
      toast.error("Failed to update notes.");
    }
  };

  const handleAddRecord = async () => {
    try {
      await addRecord({
        ...newRecord,
        year: parseInt(newRecord.year) || 0,
      });
      setAddModalOpen(false);
      setNewRecord({
        title: "",
        artist: "",
        year: "",
        genre: "",
        format: "",
        label: "",
        cover_url: "",
        barcode: "",
      });
      await loadRecords();
      toast.success("Record added!");
    } catch (err) {
      toast.error("Failed to add record!");
    }
  };

  const handleBarcodeInput = async (e) => {
    const barcode = e.target.value;
    setNewRecord({ ...newRecord, barcode });

    if (barcode.length < 5) return;

    try {
      const data = await searchDiscogs(barcode);
      if (data.length > 0) {
        const item = data[0];
        setNewRecord({
          ...newRecord,
          barcode,
          title: item.title || "",
          artist: item.artist || "",
          year: item.year || 0,
          genre: item.genre || "",
          format: item.format || "",
          label: item.label || "",
          cover_url: item.cover_url || "",
        });
        toast.success("Barcode found and fields auto-filled!");
      } else {
        toast.warning("No matching record found for barcode.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Barcode lookup failed.");
    }
  };

  return (
    <div className="grid gap-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title or artist..."
        className="border p-2 rounded w-full bg-white text-black dark:bg-zinc-800 dark:text-white mb-4"
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <Select
              value={sortBy}
              onChange={(e) => {
              setSortBy(e.target.value);
              localStorage.setItem("sortBy", e.target.value);
            }}
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="year">Year</option>
            <option value="format">Format</option>
            <option value="genre">Genre</option>
            <option value="label">Label</option>
          </Select>
        </div>
        <div>
          <label className="mr-2 text-sm font-medium">Group by:</label>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="artist">Artist</option>
            <option value="genre">Genre</option>
            <option value="format">Format</option>
            <option value="label">Label</option>
          </Select>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>➕ Add Record</Button>
        <Button onClick={() => exportToCSV(records)}>Export CSV</Button>
        <Button variant="outline" onClick={downloadDatabase}>
          Download DB
        </Button>
      </div>

      {/* Grouped records */}
      {Object.entries(groupedRecords).map(([group, groupRecords]) => {
        const sortedGroup = [...groupRecords].sort((a, b) => {
          if (sortBy === "year") {
            return (a.year || 0) - (b.year || 0);
          }
          return (a[sortBy] || "").localeCompare(b[sortBy] || "");
        });

        return (
          <div key={group}>
            <h2 className="text-lg font-semibold mb-2">{group}</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {sortedGroup.map((record) => (
                <div
                  key={record.id}
                  className="border p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelected(record);
                    setNotes(record.notes || "");
                  }}
                >
                  <div className="font-bold text-lg">
                    {record.title} ({record.year})
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {record.genre} | {record.format} | {record.label}
                  </div>
                  <img
                    src={record.cover_url}
                    alt={record.title}
                    className="h-40 w-full object-cover rounded-lg mt-2 hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold mb-2">{selected.title}</h2>
            <img
              src={selected.cover_url}
              alt={selected.title}
              className="w-full rounded"
            />
            <p className="text-sm mt-2">{selected.artist}</p>
            <p className="text-sm">
              {selected.genre} | {selected.format} | {selected.year}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              Label: {selected.label}
            </p>
            <textarea
              className="w-full border rounded p-2 text-sm bg-white text-black dark:bg-zinc-800 dark:text-white"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={updateNotes}>
                Save
              </Button>
              <Button variant="destructive" onClick={() => deleteRecord(selected.id)}>
                Delete
              </Button>
              <Button onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add New Record</h2>
            <input
              type="text"
              placeholder="Scan or Enter Barcode"
              value={newRecord.barcode || ""}
              onChange={handleBarcodeInput}
              className="border p-2 rounded text-sm bg-white text-black dark:bg-zinc-800 dark:text-white mb-4"
            />
            <div className="grid gap-3">
              {["title", "artist", "year", "genre", "format", "label"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newRecord[field]}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        [field]: e.target.value,
                      })
                    }
                    className="border p-2 rounded text-sm bg-white text-black dark:bg-zinc-800 dark:text-white"
                  />
                )
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleAddRecord}>Save</Button>
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




