// src/components/RecordCard.jsx
import React from "react";

export default function RecordCard({ record, onClick }) {
  return (
    <div
      onClick={() => onClick(record)}
      className="cursor-pointer border rounded p-4 bg-white dark:bg-zinc-900 dark:text-white hover:shadow"
    >
      <img
        src={record.cover_url || "/placeholder.png"}
        alt={record.title}
        className="w-full h-48 object-cover mb-2 rounded"
      />
      <h3 className="text-lg font-semibold">{record.title}</h3>
      <p className="text-sm">{record.artist}</p>
      <p className="text-xs text-gray-500">{record.year}</p>
    </div>
  );
}

