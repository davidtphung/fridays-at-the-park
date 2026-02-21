import { IPFS_GATEWAY, IPFS_FALLBACK_GATEWAY } from './constants';

export function resolveIpfsUrl(uri: string | undefined): string {
  if (!uri) return '';

  // Already an HTTP URL
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  // IPFS protocol
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    return `${IPFS_GATEWAY}${cid}`;
  }

  // Arweave protocol
  if (uri.startsWith('ar://')) {
    const txId = uri.replace('ar://', '');
    return `https://arweave.net/${txId}`;
  }

  // Bare CID
  if (uri.startsWith('Qm') || uri.startsWith('bafy')) {
    return `${IPFS_GATEWAY}${uri}`;
  }

  return uri;
}

export function getIpfsFallbackUrl(uri: string): string {
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    return `${IPFS_FALLBACK_GATEWAY}${cid}`;
  }
  return uri;
}

export function isIpfsUrl(url: string): boolean {
  return url.startsWith('ipfs://') || url.includes('/ipfs/');
}
