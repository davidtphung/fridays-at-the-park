'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, Vote, Hash, Box, ArrowUpRight } from 'lucide-react';

const DAO_DATA = {
  name: 'the park dao',
  chain: 'Base',
  tokenAddress: '0x72b31421a462996f559ffb7fc5dfaca94e754d89',
  treasuryAddress: '0x67bd465536f12da48b0c638c9df8475659797825',
  governorAddress: '0x22479e378ee2ae4c5f8ac6fa1c4aa83731e391cf',
  auctionAddress: '0xe95bc20728fb6be4e695c47517f4eecbee5cc21c',
  latestTokenId: 604,
  totalSupply: 410,
  ownerCount: 136,
  proposals: 9,
  nounsBuilderUrl: 'https://nouns.build/dao/base/0x72b31421a462996f559ffb7fc5dfaca94e754d89/604',
  basescanUrl: 'https://basescan.org/address/0x72b31421a462996f559ffb7fc5dfaca94e754d89',
};

interface TokenArtwork {
  name: string;
  image: string;
  description: string;
}

// Fetches the latest auction token's artwork from the on-chain tokenURI.
// Nouns Builder tokens return `data:application/json;base64,…` and the image
// field is a `https://nouns.build/api/renderer/stack-images?…` URL composed
// from the on-chain trait IPFS paths.
async function fetchTokenArtwork(tokenId: number): Promise<TokenArtwork | null> {
  const hexId = tokenId.toString(16).padStart(64, '0');
  try {
    const resp = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{ to: DAO_DATA.tokenAddress, data: '0xc87b56dd' + hexId }, 'latest'],
        id: 1,
      }),
    });
    const json = await resp.json();
    if (!json.result) return null;
    // Decode ABI-encoded string return value.
    const raw = json.result.slice(2);
    const length = parseInt(raw.slice(64, 128), 16);
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = parseInt(raw.slice(128 + i * 2, 130 + i * 2), 16);
    }
    const uri = new TextDecoder().decode(bytes);
    const prefix = 'data:application/json;base64,';
    if (!uri.startsWith(prefix)) return null;
    const meta = JSON.parse(atob(uri.slice(prefix.length)));
    return { name: meta.name ?? '', image: meta.image ?? '', description: meta.description ?? '' };
  } catch {
    return null;
  }
}

const statsCards = [
  { label: 'Total Supply', value: DAO_DATA.totalSupply.toString(), icon: Box, color: 'text-chain-base' },
  { label: 'Members', value: DAO_DATA.ownerCount.toString(), icon: Users, color: 'text-accent' },
  { label: 'Proposals', value: DAO_DATA.proposals.toString(), icon: Vote, color: 'text-success' },
  { label: 'Chain', value: DAO_DATA.chain, icon: Hash, color: 'text-chain-base' },
];

const contractLinks = [
  { label: 'Token', address: DAO_DATA.tokenAddress },
  { label: 'Treasury', address: DAO_DATA.treasuryAddress },
  { label: 'Governor', address: DAO_DATA.governorAddress },
  { label: 'Auction', address: DAO_DATA.auctionAddress },
];

export function DAOContent() {
  const [artwork, setArtwork] = useState<TokenArtwork | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTokenArtwork(DAO_DATA.latestTokenId).then((a) => {
      if (!cancelled) setArtwork(a);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card-bg border border-border rounded-xl p-5 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Auction Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card-bg border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Live Auction</h2>
            <a
              href={DAO_DATA.nounsBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              View on Nouns Builder
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="aspect-square max-w-[280px] mx-auto bg-bg-tertiary rounded-xl mb-6 overflow-hidden border border-border relative">
            {artwork?.image ? (
              // External Nouns Builder renderer (`https://nouns.build/api/renderer/...`),
              // not in next/image remotePatterns — use a plain <img>.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artwork.image}
                alt={artwork.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-7xl font-bold text-text-primary mb-3">#{DAO_DATA.latestTokenId}</p>
                  <p className="text-text-secondary text-sm font-medium">Loading…</p>
                </div>
              </div>
            )}
          </div>
          {artwork?.name && (
            <p className="text-center text-text-primary font-semibold mb-4">{artwork.name}</p>
          )}
          <div className="flex items-center justify-center">
            <a
              href={DAO_DATA.nounsBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors flex items-center gap-2"
            >
              <Wallet size={18} />
              Bid on Nouns Builder
            </a>
          </div>
        </motion.div>

        {/* Contracts Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card-bg border border-border rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-5">Contracts</h2>
          <div className="space-y-4">
            {contractLinks.map((contract) => (
              <a
                key={contract.label}
                href={`https://basescan.org/address/${contract.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1 font-medium">{contract.label}</p>
                <div className="flex items-center gap-1.5">
                  <code className="text-xs text-text-primary font-mono">
                    {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                  </code>
                  <ArrowUpRight size={12} className="text-text-secondary group-hover:text-accent transition-colors shrink-0" />
                </div>
              </a>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <a
              href={DAO_DATA.basescanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
            >
              View on BaseScan
              <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card-bg border border-border rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-3">About the Park DAO</h2>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            The Park DAO is an experiment supporting music onchain through creation, curation, collection, and great coffee.
            Built on Base using Nouns Builder, it operates as a community-governed organization with {DAO_DATA.ownerCount} members
            holding {DAO_DATA.totalSupply} governance tokens.
          </p>
          <p>
            Each token is auctioned daily, with proceeds flowing to the DAO treasury. Token holders can submit
            and vote on proposals to fund music projects, events, and creative initiatives aligned with The Park&apos;s mission.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
