// netlify/functions/uploadToPinata.js
export async function handler(event) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Function is working!" }),
  };
}
