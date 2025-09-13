import { PinataSDK } from "@pinata/web3";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body);
    const fileBuffer = Buffer.from(body.file, "base64");

    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
    });

    const result = await pinata.upload.file(fileBuffer);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
