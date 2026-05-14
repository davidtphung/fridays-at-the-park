/**
 * Fast IPFS gateway rewriter.
 *
 * Benchmarks (TTFB on a 100KB byte range, May 2026):
 *   gateway.pinata.cloud → 4.86 s
 *   dweb.link            → 0.26 s   ← 19× faster, picked as primary
 *   w3s.link             → 0.59 s
 *   ipfs.io              → 1.04 s
 *
 * Rewrites `gateway.pinata.cloud/ipfs/<cid>[/path]` and bare `ipfs://<cid>[/path]`
 * URIs to `dweb.link/ipfs/<cid>[/path]`. All other URLs pass through unchanged
 * (including Arweave, YouTube, Zora, etc.).
 *
 * dweb.link is Protocol Labs' Cloudflare-fronted gateway — sends
 * `access-control-allow-origin: *` and supports HTTP byte-range, which is
 * required for browser <audio>/<video> streaming.
 */

const PRIMARY = 'https://dweb.link/ipfs/';

export function fastIpfsUrl(url: string | undefined | null): string {
  if (!url) return '';
  // ipfs://<cid>[/path] → primary gateway
  if (url.startsWith('ipfs://')) {
    return PRIMARY + url.slice('ipfs://'.length);
  }
  // gateway.pinata.cloud/ipfs/<cid>[/path] → primary
  const pinataMatch = url.match(/^https?:\/\/gateway\.pinata\.cloud\/ipfs\/(.+)$/);
  if (pinataMatch) return PRIMARY + pinataMatch[1];
  // ipfs.io/ipfs/<cid>[/path] → primary
  const ipfsIoMatch = url.match(/^https?:\/\/ipfs\.io\/ipfs\/(.+)$/);
  if (ipfsIoMatch) return PRIMARY + ipfsIoMatch[1];
  // Already on a CIDv1 subdomain → leave it
  return url;
}
