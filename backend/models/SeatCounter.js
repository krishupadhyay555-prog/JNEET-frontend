// ============================================================
//  JNEET+ AI — models/SeatCounter.js
//  Atomic early-bird seat counter, one doc per plan (e.g. jee_pass).
//    reserved = paid early-price seats + seats held by open orders.
//  A seat is taken with { reserved: { $lt: seats } } + $inc in ONE
//  update, so two buyers can never both get the last seat.
// ============================================================
import mongoose from "mongoose";

const seatCounterSchema = new mongoose.Schema(
  {
    _id:      { type: String },              // planId
    reserved: { type: Number, default: 0, min: 0 },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.models.SeatCounter || mongoose.model("SeatCounter", seatCounterSchema);
