# Fridays at the Park — Session Handoff Document

## Project Overview

**Fridays at the Park** is a music discovery and aggregation platform for The Park, a music collective. It catalogs all of The Park's releases across onchain platforms (Zora, Catalog, Sound.xyz), streaming (Bandcamp, Spotify, Apple Music), and video (YouTube, IPFS). The site features instant audio playback, Apple-style CoverFlow UI, video episodes, and a complete onchain discography.

### Live URLs

- **Primary**: https://works.fridaysatthepark.org
- **Secondary**: https://fatp.davidtphung.com
- **Vercel Project**: `fatp-deploy` (both domains are aliases on the same project)
- **GitHub**: https://github.com/davidtphung/fridays-at-the-park

### Deploy Process

Both domains update simultaneously. Deploy via git-free Vercel deploy:

```bash
rm -rf /tmp/fatp-deploy && cp -R "/Users/davidtphung/Documents/David T Phung/Projects/Fridays at the Park Aggregator/fridays-at-the-park" /tmp/fatp-deploy && rm -rf /tmp/fatp-deploy/.git /tmp/fatp-deploy/node_modules /tmp/fatp-deploy/.next && cd /tmp/fatp-deploy && npx vercel --prod --yes
```

**Important**: The `/tmp/fatp-deploy/.vercel/project.json` must contain:
```json
{"projectId":"prj_lfAvlUXlWx6ixLl9QQd4MnJjgANR","orgId":"team_lExiFRjo7bXqm7UzAMJT4J3s","projectName":"fatp-deploy"}
```

After deploying, copy changed files to the git repo and push:
```bash
dest="/Users/davidtphung/Documents/David T Phung/Projects/Fridays at the Park Aggregator/fridays-at-the-park"
cp /tmp/fatp-deploy/src/FILE "$dest/src/FILE"
cd "$dest" && git add FILE && git commit -m "message" && git push origin main
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | App Router, SSR/SSG |
| React | 19.2.3 | UI framework |
| Tailwind CSS | v4 | Styling (via @tailwindcss/postcss) |
| Framer Motion | 12.34.3 | Animations, CoverFlow, page transitions |
| Howler.js | 2.2.4 | Audio playback (Web Audio API + HTML5 fallback) |
| Zustand | 5.0.11 | State management (player, queue, theme stores) |
| Lucide React | 0.575.0 | Icons |
| TanStack React Query | 5.90.21 | Data fetching (available but not heavily used yet) |
| TypeScript | 5.9.3 | Type safety |

---

## Architecture

### Directory Structure

```
src/
  app/                          # Next.js App Router pages
    page.tsx                    # Homepage (CoverFlow + featured grid)
    cover-flow-section.tsx      # CoverFlow wrapper connecting to playerStore
    featured-grid.tsx           # Featured tracks grid
    layout.tsx                  # Root layout (Header, Footer, GlobalPlayer, MobileTabBar)
    providers.tsx               # Client providers (QueryClient, theme)
    icon.tsx                    # Dynamic 32x32 PNG favicon (Zorb sphere)
    apple-icon.tsx              # 180x180 Apple Touch icon
    icon.svg                    # Static SVG favicon
    onchain/                    # Onchain tracks page
    episodes/                   # Episodes TV portal (Apple CoverFlow + video player)
    bandcamp/                   # Bandcamp albums grid
    dao/                        # DAO page (external link to Snapshot)
    org/                        # ORG page (external link to fridaysatthepark.org)
    about/                      # About page
    search/                     # Search page
    track/[id]/                 # Individual track detail
    artist/[slug]/              # Artist profile + discography
    api/                        # API routes (tracks, artists, episodes, featured, search, stats)
  components/
    layout/                     # Header, Footer, MobileTabBar, SkipNav
    music/                      # CoverFlow, TrackCard, TrackGrid, FilterBar, MintButton, etc.
    player/                     # GlobalPlayer, NowPlaying, PlayerControls, ProgressBar, etc.
    episodes/                   # EpisodeCard, EpisodeGrid, VideoPlayer, SeasonSelector
    bandcamp/                   # AlbumCard, AlbumGrid, BandcampEmbed, BuyButton
    artist/                     # ArtistCard, ArtistProfile, ArtistDiscography
    search/                     # SearchBar, SearchResults, SearchSuggestions
    ui/                         # Badge, Button, Modal, Skeleton, Zorb, etc.
  stores/
    playerStore.ts              # Zustand audio player state
    queueStore.ts               # Zustand queue/history state
    themeStore.ts               # Zustand theme (dark/light) state
  hooks/                        # Custom hooks (usePlayer, useQueue, useSearch, etc.)
  lib/
    mock-data.ts                # Central data file (2526 lines) — all tracks, artists, helpers
    constants.ts                # Site config, social links, nav items
    format.ts                   # Duration, date, season/episode formatters
    ipfs.ts                     # IPFS URL resolution utilities
    db.ts                       # Database utilities (Prisma — not yet connected)
  types/
    track.ts                    # Track, Credits, ExternalLinks, TrackArtist interfaces
    artist.ts                   # Artist interface
    platform.ts                 # Platform, Chain, MediaType enums + labels
    episode.ts                  # Episode types
    api.ts                      # API response types
```

### Key Files

| File | Lines | Description |
|---|---|---|
| `src/lib/mock-data.ts` | 2526 | Central data: 40 artists, 88 tracks, 13 featured, helper functions |
| `src/components/music/CoverFlow.tsx` | ~330 | Apple-style album CoverFlow with instant audio playback |
| `src/app/episodes/content.tsx` | ~614 | Episodes page: 3D CoverFlow + inline YouTube/IPFS video player |
| `src/components/player/GlobalPlayer.tsx` | ~274 | Howler.js audio player (Web Audio + HTML5 fallback) |
| `src/components/player/NowPlaying.tsx` | ~115 | Full-screen now playing view |
| `src/components/ui/Zorb.tsx` | ~25 | Glossy black sphere SVG logo component |
| `next.config.ts` | 56 | Image domains, security headers (CSP, HSTS), iframe embedding |

---

## Data Model

### 88 Total Tracks

| Platform | Count | Chain | Media Type | Notes |
|---|---|---|---|---|
| Zora (S002 audio) | 8 | Ethereum | Audio | Season 2 onchain singles |
| Zora (S002 music videos) | 13 | Base | Video | Music video NFTs on Base |
| Zora (S002 extras) | 4 | Ethereum/Base | Video/Audio | Becky film, Lasso, Happy Friday genesis, Ending Credits |
| Zora (Early ETH videos) | 4 | Ethereum | Video | fridays 002/003/004/007 sessions |
| Zora (Other ETH) | 7 | Ethereum | Video/Audio | a fridays feeling, active listening, park layover, din tai fun, Arpeggi, Light, the park DAO |
| Zora (Base collections) | 4 | Base | Video | the park based (24 tokens), FWB fest, FWB experience, onchain summer |
| Zora (Zora chain) | 2 | Zora | Video | the park experience, the park energy +++ |
| Zora (the park with the park) | 1 | Ethereum | Audio | Playable audio |
| Catalog | 2 | Ethereum | Audio | Belle, Rooms in the House |
| Sound.xyz | 1 | Ethereum | Audio | do it |
| Bandcamp (S001) | 16 | None | Audio | Season 1 full album (Bandcamp streaming) |
| Bandcamp (Early catalog) | 7 | None | Audio | Das Bass, Jeopardy, Neurm, Fallen, Silver Cloud, Burnin Up, Process Belle |
| YouTube (S001) | 6 | None | Video | Season 1 episode videos |
| YouTube (S002) | 7 | None | Video | Season 2 episode videos + trailer |
| Streaming (S002) | 3 | None | Audio | LASSO, Right Here Right Noun, Ending Credits (Apple Music/Spotify) |

### 13 Featured Tracks (CoverFlow)

These are the playable audio tracks shown in the homepage CoverFlow:
1. Becky (Zora, S002)
2. Onchain Summer (Zora, Base)
3. Belle (Catalog)
4. do it (Sound.xyz)
5. Last Straw (Zora, S002)
6. The Caller (Zora, S002)
7. HEAVEN_V2 (Zora, S002)
8. LLAMAME_V5 (Zora, S002)
9. EVERYTHING_V8 (Zora, S002)
10. Right Here Right Noun (Zora, S002)
11. Happy Friday_V2 (Zora, S002)
12. the park with the park (Zora, ETH)
13. Rooms in the House (Catalog)

### 40 Artists

Julius Rodriguez, WaveIQ, Baby Rose, Georgia Anne Muldrow, Tim Anderson, Josh Lippi, Ben Schwier, Derek Taylor, Nate Mercereau, Chloe Angelides, TOBi, MoRuf, Ray Barbee, Jessie Boykins III, The Park, Leon Knight, Being There, Haleek Maul, Syd B, Verite, Ricky Lake, Tommy Guerrero, Niia, Rob Moose, Heno, Donna Missal, Ash Leone, Dahi, Lyrah, Ti Steele, Nevada Tyler, Canelo, Chia Casanova, Darondo, Happy Mayfield, Money Mark, Daru Jones, Iman Europe, Ill Camille, Forrest Mortifee, James Cornelia

### Wallet Addresses (thepark.eth)

| Wallet | Address | Usage |
|---|---|---|
| External (thepark.eth) | `0x589FFBbdA0EaCD5A9C2BA208b379c886B2630503` | Main wallet |
| Privy | `0x08123b82232f905f2df2c67e6b9bbca2d969f837` | Privy-managed |
| Smart wallet | `0xea84d0a25e0d0fe97f8a37b6336f7cb14c9a577d` | Zora Coins creator |
| DAO treasury | `0x673d37b930397c0defb51237e6fc42fed87b722f` | DAO treasury |

---

## Features Built

### 1. Homepage CoverFlow + Audio Player

- **Apple-style 3D CoverFlow** with perspective transforms, side cover rotation, smooth animations
- **Instant audio playback** — click album art or play button to stream
- **Always-visible play buttons** on the center cover (not hidden behind hover)
- **Mobile play buttons** always visible on each card
- **"Streaming only" badges** for tracks without direct audio URLs
- **Global audio player** (Howler.js) — appears as bottom bar with progress, controls, queue
- **Full-screen Now Playing view** — album art, waveform animation, credits
- **Queue system** with history, next/previous, shuffle, repeat modes
- **MediaSession API** — system media controls integration (lock screen, headphones)
- **Web Audio API** with HTML5 fallback for CORS-restricted IPFS audio
- **Default volume: 100%**

### 2. Episodes TV Portal

- **Apple-style 3D CoverFlow** for episodes with reflections and edge fade
- **Inline video playback** — YouTube embeds play directly with autoplay
- **IPFS video support** — native `<video>` player for onchain videos
- **Zora collection links** — "Watch on Zora" button for onchain-only episodes
- **YouTube external link** — button overlay + info bar link to open on YouTube
- **"← Back" button** to return from video player to episode browser
- **Category filters** — All, Sessions, Music Videos
- **Season selector** — All Seasons, S001, S002
- **Episode grid** below CoverFlow with hover play indicators
- **Keyboard and mouse wheel navigation** for CoverFlow

### 3. Onchain Tracks Page

- **Filterable grid** of all onchain tracks
- **Platform badges** (Zora, Catalog, Sound.xyz)
- **Chain badges** (Ethereum, Base, Zora) with color-coded icons
- **Mint buttons** linking to original collection pages
- **Track detail pages** with full metadata, credits, external links

### 4. Bandcamp Page

- **Album grid** organized by album/season
- **Bandcamp embeds** for streaming
- **Buy buttons** linking to Bandcamp store
- **Season 1 full 16-track album** + early catalog releases

### 5. DAO + ORG Pages

- **DAO page** with Snapshot governance link
- **ORG page** with fridaysatthepark.org link

### 6. Branding

- **Zorb logo** — glossy black sphere SVG replacing the original red diamond
- **Dynamic favicon** — `icon.tsx` generates 32x32 PNG Zorb at build time
- **Apple Touch icon** — `apple-icon.tsx` generates 180x180 Zorb
- **Static SVG favicon** — `icon.svg` for static fallback
- **Bold black design** — dark theme with accent colors

### 7. Search

- **Full-text search** across tracks, artists, descriptions
- **Debounced input** (300ms)
- **Search suggestions** component
- **Results page** with track cards

### 8. Security & Performance

- **CSP headers** — Content-Security-Policy with allowed sources
- **HSTS** — Strict-Transport-Security with 2-year max-age
- **Iframe embedding allowed** — `frame-ancestors *` (no X-Frame-Options)
- **nosniff, referrer-policy** — Standard security headers
- **YouTube iframe sandbox** — `allow-scripts allow-same-origin allow-presentation allow-popups`
- **BandcampEmbed** — `window.open` with `noopener,noreferrer`

---

## Known Issues & Incomplete Items

### Broken Content

| Item | Issue | Details |
|---|---|---|
| `a fridays feeling` animation | IPFS 504 timeout | CID `bafybeiegdslltun3js6oselgns3sgapq6mbtu4kvbkart3okoneyqjbslm` — content may be unpinned |
| `Light` | Ownership mismatch | Listed as The Park's but was collected (not created) — description updated but may want to remove |

### Not Yet Added

| Item | Details |
|---|---|
| 107 Zora Coins | Short-form content posts on Base — not added to track catalog |
| Real-time onchain data | Currently using mock data; Prisma schema exists but not connected |
| User authentication | No auth system |
| Mint integration | Mint buttons link externally; no in-app minting |
| Audio waveform visualization | Waveform component exists but uses random animation, not real audio data |

### Placeholder Cover Images

Several newer tracks (park layover, din tai fun, the park experience, the park energy) use a shared placeholder IPFS image. These should be replaced with actual cover art from the respective contracts.

---

## Zora Contract Addresses

### Ethereum

| Collection | Contract | Supply | Type |
|---|---|---|---|
| fridays at the park 007 | `0x038A4709c0ec8Ce709Aa4c5a5533361C42eB3b63` | 193 | Video |
| fridays at the park 002 | `0x059dF4119F5f197C563107aB3C678c6ABbC83F4E` | 125 | Video |
| fridays at the park 003 | `0xeEA52A224ac506E48a6c02Fd8c8A6BD27f47b7FD` | 37 | Video |
| fridays at the park 004 | `0x1810E349048f1fFCDa6EFAE5Fe775A1971010f20` | 33 | Video |
| a fridays feeling | `0x0060DEBf2CC457b147D3B65193066Add85EB367A` | 23 | Video (BROKEN) |
| active listening | `0x263Fa8A53b19BF9a4CB6442947eb97E230BAdd87` | 27 | Image |
| the park layover I | `0xC127c00111d991ae80306373E0FDcf69dF8689AF` | 25 | Visual |
| din tai fun with TOBi | `0xEF36ceE6E5e1F26a26Ded912e05945eE1d8246D3` | 83 | Video |
| Fridays At The Park (Arpeggi) | `0xcc083B51a44877706658A5c02898999e6F6A7670` | 48 | Audio |
| the park DAO | `0x81B8EFC2b1beD7a03c633d6e6FDAB29e9D6Da8eC` | DAO | Governance |
| the park with the park | `0x88F7a4c3Bd00C52b6508B1E0B1d0D8e58A2FEd86` | - | Audio |
| Light | `0x2a738850e8d66d227ce9a6e6437007fba0e3644a` | 1 | Video (collected) |

### Base

| Collection | Contract | Supply | Type |
|---|---|---|---|
| S002 music videos (13) | Various | - | Video |
| the park based | `0x548F9043c54f1c4c6c298bb1a3dFf0fA97fDf0ea` | 24 tokens | Video |
| snapshotlopes at the park | `0x461f02737c9c3ac7d3945f6c79d180abcb540e7d` | - | Photo |
| the park experience FWB | `0x1cb19af70094768a4707086ff7a444021ded1275` | - | GIF |
| Onchain Summer | Various | - | Audio |

### Zora Network

| Collection | Contract | Type |
|---|---|---|
| the park experience | `0x40b24f1F7CB161fe83876c8357a038b12582BD8e` | Video |
| the park energy +++ | `0x3a5A8774269F728518a0B8eaC6e2f73Ba767BDa4` | Video |

### Catalog (Ethereum)

| Track | Contract | Token ID |
|---|---|---|
| Belle | `0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7` | 4373 |
| Rooms in the House | `0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7` | - |

---

## Git History (Latest → Oldest)

```
9c15755 feat: allow iframe embedding, add back button to video player, full volume default
4ce28ca fix: instant audio playback, YouTube episodes play inline with external link
41b293a feat: complete Zora discography — add 13 missing collections, Zora chain support
ec8fdfd feat: always-visible play buttons on CoverFlow album art
ff80eaf feat: replace red diamond with black zorb sphere, add dynamic favicon
f0dd65c feat: Apple CoverFlow for Episodes, full Excel catalog, security hardening
e2149c2 feat: rebuild Episodes page as immersive FATP TV portal
671f646 feat: add all 52 onchain tracks from thepark.eth, instant CoverFlow audio playback
781c237 fix: correct all titles, media types, and naming; YouTube embeds
c40025d feat: fix all media, add YouTube video player for Episodes page
6699b9b fix: correct media types and remove fake Morning Light track
82168e4 feat: add HEAVEN_V2, S002 Trailer, fix Ep3 video with real Zora tokens
746e39f fix: resolve all media — real IPFS audio, artwork, YouTube episodes
96f9ebf feat: reorder tabs to Onchain, Episodes, ORG, DAO — remove About tab
8a9c321 feat: replace all placeholder images with real IPFS and Spotify artwork
967d796 feat: reorder tabs to Onchain, ORG, Episodes, DAO, About — remove Bandcamp tab
d2af428 feat: add DAO + ORG tabs, bold black design, real video URLs, updated social links
f03bb8a feat: add 'Built by David T Phung' footer credit with X profile link
6cbeb09 feat: add real Park metadata and sample audio for playback
0117009 feat: complete Phase 1 build of Fridays at the Park music aggregator
8d0bc4d Initial commit from Create Next App
```

---

## Environment & Config

- **Node.js**: 24.x (Vercel)
- **IPFS Gateway**: `https://gateway.pinata.cloud/ipfs/` (primary), `https://nftstorage.link/ipfs/` (fallback)
- **Image domains**: Pinata, IPFS, Arweave, YouTube, Bandcamp, Spotify, Zora, Catalog
- **No environment variables required** — all data is in mock-data.ts
- **No database** — Prisma schema exists but DB not connected

---

*Last updated: March 1, 2026*
*Built by David T Phung*
