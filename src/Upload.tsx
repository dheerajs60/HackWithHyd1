// src/components/Upload.tsx
import React, { useState } from "react";

export default function Upload() {
  const [cid, setCid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setErr(null);
    setCid(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/.netlify/functions/uploadToPinata", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || JSON.stringify(data));
      } else {
        // Pinata returns IpfsHash on success
        setCid(data.IpfsHash || data.IpfsHash ?? JSON.stringify(data));
      }
    } catch (error: any) {
      setErr(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
      {cid && <p>✅ Uploaded! IPFS CID: {cid}</p>}
      {err && <p style={{ color: "red" }}>Error: {err}</p>}
    </div>
  );
}
