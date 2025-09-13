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

    // Parse the incoming body (base64 encoded by Netlify when using binary)
    const body = Buffer.from(event.body, "base64");

    // Create form-data and append file buffer
    const formData = new FormData();
    formData.append("file", body, {
      filename: "upload.png", // you can also pass through event.queryStringParameters if you want dynamic filename
      contentType: "application/octet-stream",
    });

    // Send to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
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
