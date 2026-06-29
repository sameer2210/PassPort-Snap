import { get, set, del } from 'idb-keyval';

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

const INDEX_KEY = 'passport_sessions_index';

export interface SessionMetadata {
  id: string;
  createdAt: number;
  updatedAt: number;
  size: number;
}

export async function getSessionIndex(): Promise<SessionMetadata[]> {
  const data = await get(INDEX_KEY);
  if (!data) return [];
  try {
    return (typeof data === 'string' ? JSON.parse(data) : data) as SessionMetadata[];
  } catch {
    return [];
  }
}

export async function saveSessionIndex(index: SessionMetadata[]) {
  await set(INDEX_KEY, JSON.stringify(index));
}

export async function registerSessionUpdate(id: string, serializedData: string) {
  const index = await getSessionIndex();
  const existing = index.find(item => item.id === id);
  const createdAt = existing ? existing.createdAt : Date.now();
  const updatedAt = Date.now();
  const size = estimateSize(serializedData);

  const updatedIndex = index.filter(item => item.id !== id);
  updatedIndex.push({ id, createdAt, updatedAt, size });
  await saveSessionIndex(updatedIndex);
}

export async function saveSession(id: string, stateData: unknown) {
  const sessionKey = `${SESSION_PREFIX}${id}`;
  
  // Try to get existing session to preserve createdAt
  const existingStr = await get(sessionKey);
  let createdAt = Date.now();
  if (existingStr && typeof existingStr === 'string') {
    try {
      const existing = JSON.parse(existingStr) as SessionData;
      createdAt = existing.createdAt;
    } catch {
      // ignore
    }
  }

  const sessionData: SessionData = {
    id,
    createdAt,
    updatedAt: Date.now(),
    data: stateData,
  };

  const serialized = JSON.stringify(sessionData);
  await set(sessionKey, serialized);
  
  // Update index
  await registerSessionUpdate(id, serialized);

  // Trigger cleanup after saving
  await cleanupSessions();
}

export async function cleanupSessions() {
  const index = await getSessionIndex();
  if (index.length === 0) return;

  const now = Date.now();
  let remaining = [...index];
  let sizeAfterDeletions = index.reduce((sum, item) => sum + item.size, 0);

  // 1. Delete expired sessions (>24 hours old)
  const expired = remaining.filter(s => (now - s.updatedAt) > SESSION_EXPIRY_MS);
  for (const s of expired) {
    await del(`${SESSION_PREFIX}${s.id}`);
    sizeAfterDeletions -= s.size;
  }
  remaining = remaining.filter(s => (now - s.updatedAt) <= SESSION_EXPIRY_MS);

  // 2. If total sessions > 50, delete the oldest half
  if (remaining.length > MAX_SESSIONS) {
    remaining.sort((a, b) => a.updatedAt - b.updatedAt);
    const numToDelete = Math.ceil(remaining.length / 2);
    const toDelete = remaining.slice(0, numToDelete);
    for (const s of toDelete) {
      await del(`${SESSION_PREFIX}${s.id}`);
      sizeAfterDeletions -= s.size;
    }
    remaining = remaining.slice(numToDelete);
  }

  // 3. If total IndexedDB storage > 200MB, keep deleting oldest sessions until storage is below limit
  if (sizeAfterDeletions > MAX_STORAGE_BYTES) {
    remaining.sort((a, b) => a.updatedAt - b.updatedAt);
    while (sizeAfterDeletions > MAX_STORAGE_BYTES && remaining.length > 0) {
      const oldest = remaining.shift();
      if (oldest) {
        await del(`${SESSION_PREFIX}${oldest.id}`);
        sizeAfterDeletions -= oldest.size;
      }
    }
  }

  await saveSessionIndex(remaining);
}
