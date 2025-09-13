import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Storage() {
  const [ipfsFile, setIpfsFile] = useState<File | null>(null);
  const [ipfsUploading, setIpfsUploading] = useState(false);
  const [ipfsResult, setIpfsResult] = useState<{ cid: string } | null>(null);

  const uploadToIpfs = async () => {
    if (!ipfsFile) return;
    setIpfsUploading(true);
    try {
      const form = new FormData();
      form.append('file', ipfsFile);
      const res = await fetch('/api/ipfs/pin-file', { method: 'POST', body: form });
      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch {}
      if (!res.ok) {
        const message = (json && (json.error || json.message)) || text || `Upload failed (${res.status})`;
        throw new Error(message);
      }
      const cid = (json && (json.IpfsHash || json.cid || json.hash)) as string | undefined;
      if (!cid) throw new Error('No CID returned');
      setIpfsResult({ cid });
      toast.success('File uploaded to IPFS');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Failed to upload to IPFS');
    } finally {
      setIpfsUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold web3-text-gradient">IPFS Storage</h1>
        <p className="text-muted-foreground mt-2">Upload files to IPFS via Pinata</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Select a file and upload it to IPFS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input type="file" onChange={(e) => setIpfsFile(e.target.files?.[0] || null)} />
            <Button onClick={uploadToIpfs} disabled={!ipfsFile || ipfsUploading}>
              <Upload className="w-4 h-4 mr-2" />
              {ipfsUploading ? 'Uploading…' : 'Upload to IPFS'}
            </Button>
          </div>
          {ipfsResult?.cid && (
            <div className="mt-2 text-sm">
              <div className="font-medium">CID: <code className="break-all">{ipfsResult.cid}</code></div>
              <a
                className="text-web3-primary underline inline-flex items-center gap-1"
                href={`https://gateway.pinata.cloud/ipfs/${ipfsResult.cid}`}
                target="_blank" rel="noreferrer"
              >
                <ExternalLink className="w-3 h-3" /> View on IPFS
              </a>
            </div>
          )}
          <Separator />
          <p className="text-xs text-muted-foreground">Note: Requires server env PINATA_JWT to be set.</p>
        </CardContent>
      </Card>
    </div>
  );
}
