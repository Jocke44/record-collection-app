// src/components/RecordModal.jsx
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateRecord } from "@/lib/api"; // ensure this exists
import { toast } from "sonner";

export default function RecordModal({ record, onClose }) {
  const [editedTracklist, setEditedTracklist] = useState(record.tracklist || []);

  const handleTrackChange = (index, value) => {
    const updated = [...editedTracklist];
    updated[index] = value;
    setEditedTracklist(updated);
  };

  const handleAddTrack = () => {
    setEditedTracklist([...editedTracklist, ""]);
  };

  const handleRemoveTrack = (index) => {
    setEditedTracklist(editedTracklist.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateRecord(record.id, { ...record, tracklist: editedTracklist });
      toast.success("Tracklist updated!");
      onClose();
    } catch (err) {
      toast.error("Failed to update tracklist.");
      console.error(err);
    }
  };

  return (
    <Dialog open={!!record} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-xl w-full bg-white dark:bg-zinc-900 p-6 rounded shadow">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {record.artist} – {record.title}
          </Dialog.Title>

          {record.cover && (
            <img src={record.cover} alt={record.title} className="w-full h-auto rounded mb-4" />
          )}

          <div className="space-y-2">
            {editedTracklist.map((track, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={track}
                  onChange={(e) => handleTrackChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded text-sm bg-white dark:bg-zinc-800 dark:text-white"
                />
                <Button variant="destructive" size="sm" onClick={() => handleRemoveTrack(index)}>
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddTrack} variant="outline">
              + Add Track
            </Button>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
