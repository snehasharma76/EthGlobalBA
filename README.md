# Creator Streaming Platform - World ID MiniApp

A decentralized live streaming platform built as a World ID MiniApp where creators can stream, mint their own tokens, and receive tips from viewers.

## Features

- **Live Streaming**: RTMP-based streaming with HLS playback
- **Creator Tokens**: Each creator gets their own ERC20 token on first stream
- **Tipping System**: Viewers can tip creators using WLD, USDC, or creator tokens
- **Social Features**: Follow/unfollow creators, view follower counts
- **World ID Auth**: Secure authentication via MiniKit Wallet Auth

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **MiniApp SDK**: MiniKit-JS for blockchain interactions
- **Streaming**: Node Media Server (RTMP → HLS)
- **Blockchain**: World Chain (Optimism-based)
- **Database**: JSON files (MVP)
- **Authentication**: MiniKit Wallet Auth + NextAuth

## Quick Start

### Prerequisites

- Node.js 22+ (use `nvm use 22`)
- FFmpeg (for RTMP server)
- World App installed on mobile device

### Installation

```bash
# Install dependencies
npm install

# Install FFmpeg (macOS)
brew install ffmpeg

# Copy environment file
cp .env.sample .env.local
```

### Configuration

1. Create an app at [World Developer Portal](https://developer.worldcoin.org)
2. Update `.env.local`:
   ```
   AUTH_SECRET=<run: openssl rand -base64 32>
   HMAC_SECRET_KEY=<run: openssl rand -base64 32>
   AUTH_URL=<your ngrok URL>
   NEXT_PUBLIC_APP_ID=<from Developer Portal>
   NEXT_PUBLIC_CREATOR_TOKEN_FACTORY_ADDRESS=<deployed contract>
   NEXT_PUBLIC_TIP_JAR_ADDRESS=<deployed contract>
   ```

3. Deploy smart contracts (see `contracts-reference/README.md`)
4. Whitelist contract addresses in Developer Portal

### Running the App

```bash
# Terminal 1: Start RTMP server
npm run rtmp

# Terminal 2: Start Next.js dev server
npm run dev

# Terminal 3: Expose via ngrok
ngrok http 3000
```

Update `AUTH_URL` in `.env.local` with your ngrok URL.

## Project Structure

```
├── contracts-reference/    # Smart contracts (deploy separately)
├── src/
│   ├── abi/               # Contract ABIs for MiniKit
│   ├── app/               # Next.js pages
│   │   ├── api/          # API routes
│   │   ├── create-stream/ # Stream creation page
│   │   └── page.tsx      # Home page (stream listing)
│   └── lib/
│       ├── db.ts         # JSON database functions
│       └── contracts.ts  # Contract addresses
├── server.js             # RTMP streaming server
└── data/                 # JSON database files
```

## Implementation Status

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed progress and testing checklist.

**Completed**:
- ✅ Smart contracts (reference)
- ✅ RTMP streaming server
- ✅ JSON database & API routes
- ✅ Stream creation with token minting
- ✅ Stream listing page
- ✅ Follow/unfollow system

**Pending**:
- ⏳ Stream viewer page with HLS player
- ⏳ Tipping UI with MiniKit
- ⏳ Creator profile page
- ⏳ Contract deployment & testing

## Smart Contracts

Located in `contracts-reference/`:

1. **CreatorTokenFactory.sol**: Deploys ERC20 tokens for creators
   - Token format: "CR" + first 4 chars of username
   - 1M initial supply

2. **TipJar.sol**: Handles tipping logic
   - Supports ETH and ERC20 tokens
   - Records tip history

Deploy using Remix IDE to World Chain Sepolia.

## Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Documentation

- [MiniKit Docs](https://docs.world.org/mini-apps)
- [World Chain](https://docs.world.org/world-chain)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)

## License

MIT
