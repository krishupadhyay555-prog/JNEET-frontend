// Cached "Explain with AI" for an official PYQ, per language. Saved only
// when the AI's own final answer matched NTA's key (status "ok"); a miss
// is stored as status "failed" so we don't pay for it again for a week.
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    ref:    { type: String, required: true },             // "<paper id>#<n>"
    lang:   { type: String, enum: ["english", "hinglish"], required: true },
    status: { type: String, enum: ["ok", "failed"], required: true },
    text:   { type: String, default: "" },
    model:  { type: String, default: null },
    tries:  { type: Number, default: 0 },
  },
  { timestamps: true }
);
schema.index({ ref: 1, lang: 1 }, { unique: true });

export default mongoose.model("PyqExplanation", schema);
