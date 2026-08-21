// ============================================================
//  JNEET+ AI — controllers/notesController.js  (v2 — Zod-validated)
//  CHANGED: manual 400-checks removed — createNote/updateNote now
//  rely entirely on validate(createNoteSchema) / validate(updateNoteSchema)
//  in notesRoutes.js, matching the exact pattern used by
//  testRoutes.js (validate(startTestSchema), etc). req.body arrives
//  here already trimmed and type-checked by Zod — no re-trimming
//  or re-checking needed in the controller itself.
//  Search behavior (regex "anywhere in text", case-insensitive)
//  and preview-building — UNCHANGED from v1.
// ============================================================

import Note from "../models/Note.js";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPreview(content, maxLen = 90) {
  const firstLine = content.split("\n").find((line) => line.trim().length > 0) || content;
  const trimmed = firstLine.trim();
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen).trimEnd()}…` : trimmed;
}

// ── GET /notes?q=searchTerm ──────────────────────────────────
export const getNotes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = { userId: req.user.id };

    if (q && q.trim()) {
      const safe = escapeRegex(q.trim());
      filter.$or = [
        { content: { $regex: safe, $options: "i" } },
        { tag:     { $regex: safe, $options: "i" } },
      ];
    }

    const notes = await Note.find(filter)
      .select("content tag createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const results = notes.map((n) => ({
      _id:       n._id,
      preview:   buildPreview(n.content),
      tag:       n.tag || "",
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));

    return res.json({ success: true, notes: results });

  } catch (err) {
    next(err);
  }
};

// ── GET /notes/:id — full content, for opening the editor ───
export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).lean();

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    return res.json({ success: true, note });

  } catch (err) {
    next(err);
  }
};

// ── POST /notes ───────────────────────────────────────────────
export const createNote = async (req, res, next) => {
  try {
    const { content, tag } = req.body;

    const note = await Note.create({
      userId:  req.user.id,
      content,
      tag,
    });

    return res.status(201).json({ success: true, note });

  } catch (err) {
    next(err);
  }
};

// ── PATCH /notes/:id ─────────────────────────────────────────
export const updateNote = async (req, res, next) => {
  try {
    const { content, tag } = req.body;

    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    if (content !== undefined) note.content = content;
    if (tag !== undefined)     note.tag = tag;

    await note.save();

    return res.json({ success: true, note });

  } catch (err) {
    next(err);
  }
};

// ── DELETE /notes/:id ────────────────────────────────────────
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    return res.json({ success: true });

  } catch (err) {
    next(err);
  }
};