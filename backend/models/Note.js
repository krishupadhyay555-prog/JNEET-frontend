// ============================================================
//  JNEET+ AI — models/Note.js  (NEW)
//  Simple free-text notes — "phone notes" style. No title field:
//  the first non-empty line of `content` is used as a preview on
//  the list screen (computed in the controller, not stored, so
//  there's no risk of a stale preview after an edit). `tag` is
//  fully optional — students can label a misplaced note (e.g. a
//  Physics formula accidentally written under Biology) so it's
//  still findable via search.
// ============================================================

import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Note content is required."],
      trim: true,
      maxlength: [10000, "Note is too long (max 10,000 characters)."],
    },
    tag: {
      type: String,
      trim: true,
      maxlength: [40, "Tag is too long (max 40 characters)."],
      default: "",
    },
  },
  { timestamps: true }
);

// Supports the default "recent notes first" list view efficiently.
noteSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model("Note", noteSchema);