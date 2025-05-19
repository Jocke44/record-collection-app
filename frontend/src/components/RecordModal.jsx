// src/components/RecordModal.jsx
import { Dialog } from "@headlessui/react";

export default function RecordModal({ record, onClose }) {
  if (!record) return null;

  return (
    <Dialog open={!!record} onClose={onClose} as="div">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <div className="relative bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
          <Dialog.Title className="text-lg font-bold mb-2">
            {record.title} — {record.artist}
          </Dialog.Title>

          <p className="mb-1"><strong>Year:</strong> {record.year || "N/A"}</p>
          <p className="mb-1"><strong>Genre:</strong> {record.genre || "N/A"}</p>
          <p className="mb-1"><strong>Format:</strong> {record.format || "N/A"}</p>
          <p className="mb-3"><strong>Label:</strong> {record.label || "N/A"}</p>

          {record.tracklist?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-1">Tracklist:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {record.tracklist.map((track, i) => (
                  <li key={i}>{track}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-right">
            <button
              onClick={onClose}
              className="px-4 py-1 rounded bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
