// frontend/src/pages/GroupedCollection.jsx
import { useState, useEffect } from "react";
import { getRecords } from "@/lib/api";

export default function GroupedCollection() {
  const [records, setRecords] = useState([]);
  const [grouped, setGrouped] = useState(false);

  useEffect(() => {
    getRecords().then(setRecords);
  }, []);

  const groupedByArtist = records.reduce((acc, record) => {
    if (!acc[record.artist]) acc[record.artist] = [];
    acc[record.artist].push(record);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Collection</h1>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={grouped}
            onChange={(e) => setGrouped(e.target.checked)}
          />
          Group by artist
        </label>
      </div>

      {grouped ? (
        Object.entries(groupedByArtist).map(([artist, albums]) => (
          <div key={artist} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{artist}</h2>
            <div className="grid grid-cols-2 gap-4">
              {albums.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordCard({ record }) {
  return (
    <div className="border rounded p-3 bg-white dark:bg-zinc-800">
      <img src={record.cover_url} alt={record.title} className="w-full h-40 object-cover rounded mb-2" />
      <h3 className="font-bold">{record.title}</h3>
      <p className="text-sm text-gray-500">{record.year} • {record.format}</p>
    </div>
  );
}
