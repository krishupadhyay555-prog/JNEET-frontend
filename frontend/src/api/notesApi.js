// ============================================================
//  JNEET+ AI — api/notesApi.js  (v2 — works offline)
//  Same interface as before (list/get/create/update/remove returning
//  axios-shaped { data }), but:
//   - every note the student sees is cached in IndexedDB;
//   - with no network (or a very slow one that times out), reading,
//     searching, creating, editing and deleting all keep working locally;
//   - changes made offline wait in an outbox and sync automatically when
//     the connection returns (on the 'online' event, on app load, and
//     before the next list).
//   - conflicts: last write wins (a note edited on two devices keeps the
//     version synced last).
//  The cache is tied to the signed-in student and wiped on logout.
// ============================================================

import api from "./axiosInstance.js";
import { idb } from "../offline/idb.js";

const LOCAL = "local-";
const T = { timeout: 8000 }; // weak network: give up after 8s and use the local copy
const isLocalId = (id) => typeof id === "string" && id.startsWith(LOCAL);
const newLocalId = () => `${LOCAL}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

// No HTTP response at all = offline / unreachable / timed out.
const isOffline = (err) => !err?.response && (err?.isNetworkError || err?.isTimeout || err?.code === "ERR_NETWORK");

function previewOf(content) {
  const line = (content || "").split("\n").find((l) => l.trim()) || content || "";
  const t = line.trim();
  return t.length > 90 ? `${t.slice(0, 90).trimEnd()}…` : t;
}

const toListItem = (n) => ({
  _id: n._id,
  preview: n.preview ?? previewOf(n.content),
  tag: n.tag || "",
  createdAt: n.createdAt,
  updatedAt: n.updatedAt,
  pending: !!n.pending,
});

const emit = (name) => { try { window.dispatchEvent(new Event(name)); } catch { /* ssr/no window */ } };

// ── Owner guard ──────────────────────────────────────────────
let currentUser = null;
export async function bindOfflineUser(userId) {
  currentUser = userId ? String(userId) : null;
  try {
    if (!currentUser) return;
    const meta = await idb.get("meta", "owner");
    if (meta && meta.value !== currentUser) await idb.clearAll();
    if (!meta || meta.value !== currentUser) await idb.put("meta", { key: "owner", value: currentUser });
    flushOutbox();
  } catch { /* offline cache unavailable — online-only */ }
}
export async function clearOfflineData() {
  currentUser = null;
  await idb.clearAll();
}

// ── Outbox ───────────────────────────────────────────────────
let flushing = false;
export async function pendingCount() {
  try { return (await idb.getAll("outbox")).length; } catch { return 0; }
}

export async function flushOutbox() {
  if (flushing || !currentUser || (typeof navigator !== "undefined" && navigator.onLine === false)) return;
  flushing = true;
  let changed = false;
  try {
    const ops = (await idb.getAll("outbox")).sort((a, b) => a.seq - b.seq);
    for (const op of ops) {
      try {
        if (op.type === "create") {
          const res = await api.post("/notes", op.data);
          const server = res.data.note;
          await idb.del("notes", op.localId);
          await idb.put("notes", { ...server, preview: previewOf(server.content) });
          // later ops that referenced the temp id now target the real one
          for (const later of ops) if (later.id === op.localId) { later.id = server._id; await idb.put("outbox", later); }
        } else if (op.type === "update") {
          const res = await api.patch(`/notes/${op.id}`, op.data);
          await idb.put("notes", { ...res.data.note, preview: previewOf(res.data.note.content) });
        } else if (op.type === "delete") {
          try { await api.delete(`/notes/${op.id}`); } catch (e) { if (e.response?.status !== 404) throw e; }
        }
        await idb.del("outbox", op.seq);
        changed = true;
      } catch (err) {
        if (isOffline(err)) break;               // still offline: try again later
        if (err.response?.status >= 500) break;  // server trouble: keep the change
        await idb.del("outbox", op.seq);         // permanent rejection (e.g. 404/400): drop, don't block the queue
        changed = true;
      }
    }
  } catch { /* cache unavailable */ } finally {
    flushing = false;
  }
  if (changed) emit("jneet:notes-synced");
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => { flushOutbox(); });
}

// ── Local helpers ────────────────────────────────────────────
async function localList(q) {
  const all = await idb.getAll("notes");
  const needle = q?.trim().toLowerCase();
  return all
    .filter((n) => !needle || (n.content || n.preview || "").toLowerCase().includes(needle) || (n.tag || "").toLowerCase().includes(needle))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(toListItem);
}

let prefetching = false;
async function prefetchFullNotes(items) {
  if (prefetching) return;
  prefetching = true;
  try {
    const queue = [];
    for (const it of items) {
      const cached = await idb.get("notes", it._id);
      if (!cached || cached.content === undefined || cached.updatedAt !== it.updatedAt) queue.push(it._id);
    }
    const worker = async () => {
      while (queue.length) {
        const id = queue.shift();
        try {
          const res = await api.get(`/notes/${id}`);
          const n = res.data.note;
          await idb.put("notes", { ...n, preview: previewOf(n.content) });
        } catch { /* try again next time */ }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  } finally { prefetching = false; }
}

// ── Public API (axios-shaped results) ────────────────────────
export const notesApi = {
  async list(q) {
    await flushOutbox();
    try {
      const res = await api.get("/notes", { ...T, params: q ? { q } : {} });
      const server = res.data.notes ?? [];
      if (!q) {
        try {
          const local = await idb.getAll("notes");
          const serverIds = new Set(server.map((n) => n._id));
          // drop cached notes deleted elsewhere, keep unsynced local ones
          for (const n of local) if (!isLocalId(n._id) && !n.pending && !serverIds.has(n._id)) await idb.del("notes", n._id);
          for (const n of server) {
            const cached = await idb.get("notes", n._id);
            if (cached?.pending) continue; // our unsynced edit wins until it is flushed
            await idb.put("notes", { ...cached, ...n, content: cached && cached.updatedAt === n.updatedAt ? cached.content : undefined });
          }
          prefetchFullNotes(server);
          const pendingLocal = (await idb.getAll("notes")).filter((n) => isLocalId(n._id)).map(toListItem);
          return { data: { success: true, notes: [...pendingLocal, ...server], offline: false } };
        } catch { /* cache problem: still return server data */ }
      }
      return { data: { success: true, notes: server, offline: false } };
    } catch (err) {
      if (!isOffline(err)) throw err;
      try { return { data: { success: true, notes: await localList(q), offline: true } }; } catch { throw err; }
    }
  },

  async get(id) {
    if (!isLocalId(id)) {
      try {
        const res = await api.get(`/notes/${id}`, T);
        try { await idb.put("notes", { ...res.data.note, preview: previewOf(res.data.note.content) }); } catch { /* ignore */ }
        return res;
      } catch (err) {
        if (!isOffline(err)) throw err;
      }
    }
    const n = await idb.get("notes", id).catch(() => null);
    if (n && n.content !== undefined) return { data: { success: true, note: n, offline: true } };
    const e = new Error("Note not available offline");
    e.isNetworkError = true;
    throw e;
  },

  async create(data) {
    try {
      const res = await api.post("/notes", data, T);
      try { await idb.put("notes", { ...res.data.note, preview: previewOf(res.data.note.content) }); } catch { /* ignore */ }
      return res;
    } catch (err) {
      if (!isOffline(err)) throw err;
      const now = new Date().toISOString();
      const note = { _id: newLocalId(), content: data.content, tag: data.tag || "", createdAt: now, updatedAt: now, pending: true };
      await idb.put("notes", { ...note, preview: previewOf(note.content) });
      await idb.add("outbox", { type: "create", localId: note._id, data: { content: note.content, tag: note.tag } });
      emit("jneet:notes-pending");
      return { data: { success: true, note, offline: true } };
    }
  },

  async update(id, data) {
    if (!isLocalId(id)) {
      try {
        const res = await api.patch(`/notes/${id}`, data, T);
        try { await idb.put("notes", { ...res.data.note, preview: previewOf(res.data.note.content) }); } catch { /* ignore */ }
        return res;
      } catch (err) {
        if (!isOffline(err)) throw err;
      }
    }
    const cached = await idb.get("notes", id);
    const now = new Date().toISOString();
    const merged = { ...(cached || { _id: id, createdAt: now }), ...data, updatedAt: now, pending: true };
    merged.preview = previewOf(merged.content);
    await idb.put("notes", merged);
    // A still-unsynced create just absorbs the edit; otherwise queue an update.
    const ops = await idb.getAll("outbox");
    const pendingCreate = ops.find((o) => o.type === "create" && o.localId === id);
    if (pendingCreate) {
      pendingCreate.data = { content: merged.content, tag: merged.tag || "" };
      await idb.put("outbox", pendingCreate);
    } else {
      await idb.add("outbox", { type: "update", id, data: { content: merged.content, tag: merged.tag || "" } });
    }
    emit("jneet:notes-pending");
    return { data: { success: true, note: merged, offline: true } };
  },

  async remove(id) {
    if (!isLocalId(id)) {
      try {
        const res = await api.delete(`/notes/${id}`, T);
        try { await idb.del("notes", id); } catch { /* ignore */ }
        return res;
      } catch (err) {
        if (!isOffline(err)) throw err;
      }
    }
    await idb.del("notes", id);
    const ops = await idb.getAll("outbox");
    const pendingCreate = ops.find((o) => o.type === "create" && o.localId === id);
    if (pendingCreate) {
      await idb.del("outbox", pendingCreate.seq);        // never reached the server
      for (const o of ops) if (o.id === id) await idb.del("outbox", o.seq);
    } else {
      for (const o of ops) if (o.type === "update" && o.id === id) await idb.del("outbox", o.seq);
      await idb.add("outbox", { type: "delete", id });
    }
    emit("jneet:notes-pending");
    return { data: { success: true, offline: true } };
  },
};
