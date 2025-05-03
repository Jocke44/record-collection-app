import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";

export function ScannerModal({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromConstraints(
      { video: { facingMode: "environment" } },
      videoRef.current,
      (result, error, controls) => {
        if (result) {
          onDetected(result.getText());
          if (controls) controls.stop();
          onClose();
        }
        if (controls) {
          controlsRef.current = controls;
        }
      }
    ).catch((err) => {
      console.error("Scanner start failed", err);
      setError(err.message || "Camera error");
      onClose();
    });

    return () => {
        if (controlsRef.current) {
          controlsRef.current.stop();
        }
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
      ;
  }, [onDetected, onClose]);

  const handleCancel = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-center">📷 Scan Barcode</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <video ref={videoRef} className="rounded" style={{ width: 300, height: 300 }} autoPlay />
        )}
        <div className="flex justify-center mt-4">
          <Button variant="destructive" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}



