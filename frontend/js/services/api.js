const apiUrl = "http://localhost:3000/api";

// Simple in-memory cache for GET requests (short TTL)
const getCache = new Map();
const DEFAULT_TTL = 5000; // 5s

export async function apiGet(path, { cache = true, ttl = DEFAULT_TTL } = {}) {
  const key = path;
  if (cache && getCache.has(key)) {
    const entry = getCache.get(key);
    if (Date.now() - entry.ts < entry.ttl) {
      return entry.data;
    } else {
      getCache.delete(key);
    }
  }

  const response = await fetch(`${apiUrl}${path}`);
  const data = await response.json();

  if (cache && response.ok) {
    try {
      getCache.set(key, { data, ts: Date.now(), ttl });
    } catch (e) {}
  }

  return data;
}

export async function apiPost(path, data) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response;
}

export async function apiPut(path, data) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response;
}

