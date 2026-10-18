// ============================================================
//  JNEET+ AI — offline/idb.js
//  Tiny promise wrapper over IndexedDB (no dependency). One database,
//  three stores: notes (cached/edited notes), outbox (changes made
//  offline, waiting to sync) and meta (which user owns this cache).
//  Every function resolves to a safe fallback if IndexedDB is
//  unavailable (private mode, blocked storage): the app then simply
//  behaves as online-only.
// ============================================================

const DB_NAME = "jneet-offline";
const DB_VERSION = 1;

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") { reject(new Error("no-idb")); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("notes"))  db.createObjectStore("notes", { keyPath: "_id" });
      if (!db.objectStoreNames.contains("outbox")) db.createObjectStore("outbox", { keyPath: "seq", autoIncrement: true });
      if (!db.objectStoreNames.contains("meta"))   db.createObjectStore("meta", { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }).catch((err) => { dbPromise = null; throw err; });
  return dbPromise;
}

async function run(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const s = tx.objectStore(store);
    let result;
    const r = fn(s);
    if (r && typeof r === "object" && "onsuccess" in r) r.onsuccess = () => { result = r.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const idb = {
  available: async () => { try { await open(); return true; } catch { return false; } },
  getAll: (store) => run(store, "readonly", (s) => s.getAll()),
  get:    (store, key) => run(store, "readonly", (s) => s.get(key)),
  put:    (store, value) => run(store, "readwrite", (s) => s.put(value)),
  add:    (store, value) => run(store, "readwrite", (s) => s.add(value)),
  del:    (store, key) => run(store, "readwrite", (s) => s.delete(key)),
  clear:  (store) => run(store, "readwrite", (s) => s.clear()),
  async clearAll() {
    try { await Promise.all(["notes", "outbox", "meta"].map((s) => this.clear(s))); } catch { /* nothing to clear */ }
  },
};
