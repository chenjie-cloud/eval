import { normalizeState } from "./logic.js";

function safeStorage(storage) {
  if (!storage) return null;
  if (typeof storage.getItem !== "function") return null;
  if (typeof storage.setItem !== "function") return null;
  if (typeof storage.removeItem !== "function") return null;
  return storage;
}

export function loadState(key, options = {}) {
  const storage = safeStorage(options.storage ?? globalThis.localStorage);
  if (!storage) return null;

  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

export function saveState(key, state, options = {}) {
  const storage = safeStorage(options.storage ?? globalThis.localStorage);
  if (!storage) return false;

  try {
    storage.setItem(key, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(key, options = {}) {
  const storage = safeStorage(options.storage ?? globalThis.localStorage);
  if (!storage) return false;
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

