import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const STREAMS_FILE = path.join(DB_PATH, 'streams.json');
const CREATORS_FILE = path.join(DB_PATH, 'creators.json');
const FOLLOWS_FILE = path.join(DB_PATH, 'follows.json');

interface Stream {
  id: string;
  creatorAddress: string;
  title: string;
  streamKey: string;
  isLive: boolean;
  viewerCount: number;
  createdAt: string;
  rtmpUrl: string;
  hlsUrl: string;
}

interface Creator {
  address: string;
  username: string;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  followerCount: number;
  totalTips: string;
  createdAt: string;
}

interface Follow {
  followerAddress: string;
  creatorAddress: string;
  followedAt: string;
}

function ensureDbExists() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
  }
  
  if (!fs.existsSync(STREAMS_FILE)) {
    fs.writeFileSync(STREAMS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(CREATORS_FILE)) {
    fs.writeFileSync(CREATORS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(FOLLOWS_FILE)) {
    fs.writeFileSync(FOLLOWS_FILE, JSON.stringify([]));
  }
}

export function getStreams(): Stream[] {
  ensureDbExists();
  const data = fs.readFileSync(STREAMS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function saveStream(stream: Stream) {
  ensureDbExists();
  const streams = getStreams();
  const existingIndex = streams.findIndex(s => s.id === stream.id);
  
  if (existingIndex >= 0) {
    streams[existingIndex] = stream;
  } else {
    streams.push(stream);
  }
  
  fs.writeFileSync(STREAMS_FILE, JSON.stringify(streams, null, 2));
}

export function getCreators(): Creator[] {
  ensureDbExists();
  const data = fs.readFileSync(CREATORS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getCreator(address: string): Creator | null {
  const creators = getCreators();
  return creators.find(c => c.address.toLowerCase() === address.toLowerCase()) || null;
}

export function saveCreator(creator: Creator) {
  ensureDbExists();
  const creators = getCreators();
  const existingIndex = creators.findIndex(c => c.address.toLowerCase() === creator.address.toLowerCase());
  
  if (existingIndex >= 0) {
    creators[existingIndex] = creator;
  } else {
    creators.push(creator);
  }
  
  fs.writeFileSync(CREATORS_FILE, JSON.stringify(creators, null, 2));
}

export function getFollows(): Follow[] {
  ensureDbExists();
  const data = fs.readFileSync(FOLLOWS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function addFollow(followerAddress: string, creatorAddress: string) {
  ensureDbExists();
  const follows = getFollows();
  
  const exists = follows.some(
    f => f.followerAddress.toLowerCase() === followerAddress.toLowerCase() &&
         f.creatorAddress.toLowerCase() === creatorAddress.toLowerCase()
  );
  
  if (!exists) {
    follows.push({
      followerAddress,
      creatorAddress,
      followedAt: new Date().toISOString()
    });
    fs.writeFileSync(FOLLOWS_FILE, JSON.stringify(follows, null, 2));
    
    const creator = getCreator(creatorAddress);
    if (creator) {
      creator.followerCount++;
      saveCreator(creator);
    }
  }
}

export function removeFollow(followerAddress: string, creatorAddress: string) {
  ensureDbExists();
  const follows = getFollows();
  
  const filtered = follows.filter(
    f => !(f.followerAddress.toLowerCase() === followerAddress.toLowerCase() &&
           f.creatorAddress.toLowerCase() === creatorAddress.toLowerCase())
  );
  
  if (filtered.length < follows.length) {
    fs.writeFileSync(FOLLOWS_FILE, JSON.stringify(filtered, null, 2));
    
    const creator = getCreator(creatorAddress);
    if (creator && creator.followerCount > 0) {
      creator.followerCount--;
      saveCreator(creator);
    }
  }
}

export function isFollowing(followerAddress: string, creatorAddress: string): boolean {
  const follows = getFollows();
  return follows.some(
    f => f.followerAddress.toLowerCase() === followerAddress.toLowerCase() &&
         f.creatorAddress.toLowerCase() === creatorAddress.toLowerCase()
  );
}

export function getCreatorFollowers(creatorAddress: string): Follow[] {
  const follows = getFollows();
  return follows.filter(f => f.creatorAddress.toLowerCase() === creatorAddress.toLowerCase());
}

export function getLiveStreams(): Stream[] {
  const streams = getStreams();
  return streams.filter(s => s.isLive);
}

export function getStreamsByCreator(creatorAddress: string): Stream[] {
  const streams = getStreams();
  return streams.filter(s => s.creatorAddress.toLowerCase() === creatorAddress.toLowerCase());
}
