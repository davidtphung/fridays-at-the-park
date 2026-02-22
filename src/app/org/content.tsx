'use client';

import { motion } from 'framer-motion';
import { Globe, ArrowUpRight, ExternalLink as LinkIcon, Music, Users, MapPin, Calendar, Coffee } from 'lucide-react';

const ORG_LINKS = [
  {
    title: 'Official Website',
    description: 'Visit the Fridays at The Park organization site',
    url: 'https://fridaysatthepark.org/',
    icon: Globe,
  },
  {
    title: 'The Park',
    description: 'Main hub at thepark.wtf',
    url: 'https://thepark.wtf',
    icon: Music,
  },
  {
    title: 'Instagram',
    description: '@fridaysatthepark',
    url: 'https://instagram.com/fridaysatthepark',
    icon: Users,
  },
  {
    title: 'X / Twitter',
    description: '@fridayspark',
    url: 'https://x.com/fridayspark',
    icon: LinkIcon,
  },
];

const HIGHLIGHTS = [
  {
    icon: Music,
    title: 'Music Onchain',
    description: 'Original music produced with friends every Friday, published onchain on Base.',
  },
  {
    icon: Coffee,
    title: 'Community',
    description: 'A creative space for friends to create, mix, master, and publish music together.',
  },
  {
    icon: MapPin,
    title: 'Global',
    description: 'From Los Angeles to Kampala, Uganda — creating music across borders.',
  },
  {
    icon: Calendar,
    title: 'Every Friday',
    description: 'Weekly sessions from idea to onchain, start to finish, every single Friday.',
  },
];

export function ORGContent() {
  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-card-bg border border-border rounded-xl"
      >
        <div className="aspect-[21/9] w-full bg-gradient-to-br from-accent/20 via-bg-tertiary to-chain-base/20 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-3">fridaysatthepark.org</h2>
            <p className="text-text-secondary text-lg mb-6">The official organization behind Fridays at The Park</p>
            <a
              href="https://fridaysatthepark.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors text-lg"
            >
              <Globe size={20} />
              Visit Site
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HIGHLIGHTS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-card-bg border border-border rounded-xl p-5 hover:border-accent/30 transition-colors"
          >
            <item.icon size={20} className="text-accent mb-3" />
            <h3 className="font-semibold text-text-primary text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Links Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ORG_LINKS.map((link, i) => (
            <motion.a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-4 p-4 bg-card-bg border border-border rounded-xl hover:border-accent/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center shrink-0">
                <link.icon size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary text-sm">{link.title}</p>
                <p className="text-xs text-text-secondary truncate">{link.description}</p>
              </div>
              <ArrowUpRight size={16} className="text-text-secondary group-hover:text-accent transition-colors shrink-0" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card-bg border border-border rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-3">About</h2>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Fridays at The Park is a creative collective that produces original music with friends onchain every Friday.
            The Park is a creative space where a group of friends come together to create, mix, master, and publish music
            from start to finish — from idea to onchain — every single week.
          </p>
          <p>
            Throughout the year, creative works are put onchain on Base — including music, videos, albums, talks, moments,
            and artifacts. The project has expanded globally, creating with friends from Los Angeles to Kampala, Uganda
            and beyond.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
