import { get, set, del, keys, entries } from 'idb-keyval';

const SESSION_PREFIX = 'passport_session_';
const MAX_SESSIONS = 50;
const MAX_STORAGE_BYTES = 200 * 1024 * 1024; // 200MB
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SessionData {
  id: string;
  createdAt: number;
  updatedAt: number;
  data: unknown; // The Zustand state or photo data
}

// Helper to estimate size of a string (rough estimation for UTF-16)
function estimateSize(str: string): number {
  return str.length * 2;
}

export async function saveSession(id: string, stateData: unknown) {
  const sessionKey = `${SESSION_PREFIX}${id}`;
  
  // Try to get existing session to preserve createdAt
  const existingStr = await get(sessionKey);
  let createdAt = Date.now();
  if (existingStr) {
    try {
      const existing = JSON.parse(existingStr) as SessionData;
      createdAt = existing.createdAt;
    } catch (e) {
      // ignore
    }
  }

  const sessionData: SessionData = {
    id,
    createdAt,
    updatedAt: Date.now(),
    data: stateData,
  };

  await set(sessionKey, JSON.stringify(sessionData));
  
  // Trigger cleanup after saving
  await cleanupSessions();
}

export async function loadSession(id: string): Promise<SessionData | null> {
  const sessionKey = `${SESSION_PREFIX}${id}`;
  const dataStr = await get(sessionKey);
  if (!dataStr) return null;
  try {
    return JSON.parse(dataStr) as SessionData;
  } catch (e) {
    return null;
  }
}

export async function cleanupSessions() {
  const allKeys = await keys();
  const sessionKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(SESSION_PREFIX)) as string[];
  
  if (sessionKeys.length === 0) return;

  const sessionEntries = await entries();
  const sessions: { key: string; session: SessionData; size: number }[] = [];

  let totalSize = 0;

  for (const [key, value] of sessionEntries) {
    if (typeof key === 'string' && key.startsWith(SESSION_PREFIX) && typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as SessionData;
        const size = estimateSize(value);
        sessions.push({ key, session: parsed, size });
        totalSize += size;
      } catch (e) {
        // Corrupted session data, delete it immediately
        await del(key);
      }
    }
  }

  // Sort sessions by updatedAt (oldest first)
  sessions.sort((a, b) => a.session.updatedAt - b.session.updatedAt);

  const now = Date.now();
  let sizeAfterDeletions = totalSize;
  let remainingSessions = [...sessions];

  // 1. Delete expired sessions (>24 hours old)
  const expired = remainingSessions.filter(s => (now - s.session.updatedAt) > SESSION_EXPIRY_MS);
  for (const s of expired) {
    await del(s.key);
    sizeAfterDeletions -= s.size;
  }
  remainingSessions = remainingSessions.filter(s => (now - s.session.updatedAt) <= SESSION_EXPIRY_MS);

  // 2. If total sessions > 50, delete the oldest half
  if (remainingSessions.length > MAX_SESSIONS) {
    const numToDelete = Math.ceil(remainingSessions.length / 2);
    const toDelete = remainingSessions.slice(0, numToDelete);
    for (const s of toDelete) {
      await del(s.key);
      sizeAfterDeletions -= s.size;
    }
    remainingSessions = remainingSessions.slice(numToDelete);
  }

  // 3. If total IndexedDB storage > 200MB, keep deleting oldest sessions until storage is below limit
  while (sizeAfterDeletions > MAX_STORAGE_BYTES && remainingSessions.length > 0) {
    const oldest = remainingSessions.shift(); // remove oldest from array
    if (oldest) {
      await del(oldest.key);
      sizeAfterDeletions -= oldest.size;
    }
  }
}
