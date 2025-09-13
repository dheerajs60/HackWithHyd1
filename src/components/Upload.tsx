import React, { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setCid(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/.netlify/functions/uploadToPinata", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setCid(data.IpfsHash); // Pinata returns { IpfsHash, PinSize, Timestamp }
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Upload to IPFS</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="border rounded p-2 w-full"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {cid && (
        <p className="text-green-600">
          ✅ Uploaded! CID:{" "}
          <a
            href={`https://gateway.pinata.cloud/ipfs/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {cid}
          </a>
        </p>
      )}

      {error && <p className="text-red-600">❌ {error}</p>}
    </div>
  );
}
