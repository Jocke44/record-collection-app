// src/components/RecordModal.jsx
import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

export default function RecordModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
        <Dialog.Title className="text-xl font-semibold mb-2">
          {record.title} – {record.artist}
        </Dialog.Title>

        <p className="mb-2 text-sm text-zinc-500">{record.year} • {record.format} • {record.genre}</p>

        <img
          src={record.cover_url}
          alt={record.title}
          className="w-full h-auto object-cover rounded mb-4"
        />

        {record.tracklist?.length ? (
          <div className="mb-4">
            <h3 className="font-medium text-lg mb-1">Tracklist</h3>
            <ul className="list-disc list-inside text-sm">
              {record.tracklist.map((track, index) => (
                <li key={index}>{track}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 italic mb-4">No tracklist available</p>
        )}

        <div className="text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
