import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'ipfs-proxy',
      configureServer(server) {
        server.middlewares.use('/api/ipfs/pin-file', async (req, res, next) => {
          if (req.method !== 'POST') return next();
          const jwt = process.env.PINATA_JWT;
          if (!jwt) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'PINATA_JWT not set' }));
            return;
          }
          try {
            const headers = { Authorization: `Bearer ${jwt}` } as Record<string, string>;
            const ct = req.headers['content-type'];
            if (ct && typeof ct === 'string') headers['Content-Type'] = ct;
            // Buffer the incoming request to avoid stream re-use issues
            const chunks: Buffer[] = [];
            for await (const chunk of req as any) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const bodyBuffer = Buffer.concat(chunks);
            const upstream = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
              method: 'POST',
              headers,
              body: bodyBuffer,
            });
            const contentType = upstream.headers.get('content-type') || 'application/json';
            res.statusCode = upstream.status;
            res.setHeader('Content-Type', contentType);
            const buf = Buffer.from(await upstream.arrayBuffer());
            res.end(buf);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Upload failed' }));
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
