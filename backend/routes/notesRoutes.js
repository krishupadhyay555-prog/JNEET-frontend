// ============================================================
//  JNEET+ AI — routes/notesRoutes.js  (v2 — Zod validation wired)
//  CHANGED: added validate(createNoteSchema) / validate(updateNoteSchema)
//  to the POST/PATCH routes — same pattern as testRoutes.js.
//  Route ordering/methods UNCHANGED from v1.
// ============================================================

import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createNoteSchema, updateNoteSchema } from "../schemas/notesSchemas.js";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const router = Router();

router.use(protect);

router.get("/",      getNotes);
router.get("/:id",   getNote);
router.post("/",     validate(createNoteSchema), createNote);
router.patch("/:id", validate(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);

export default router;