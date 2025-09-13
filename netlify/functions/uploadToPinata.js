import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // decode base64 body (Netlify passes it like that)
    const body = Buffer.from(event.body, "base64");

    const formData = new FormData();
    formData.append("file", body, {
      filename: "upload.bin",
      contentType: "application/octet-stream",
    });

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`, // 🔒 secure usage
      },
      body: formData,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
