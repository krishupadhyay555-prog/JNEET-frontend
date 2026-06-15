// ============================================================
//  JNEET+ AI — routes/chatRoutes.js  (Production v2.0)
//  Route definitions only — zero business logic inline.
//  All handlers in controllers/chatController.js.
// ============================================================

import { Router }  from "express";
import { protect }       from "../middleware/authMiddleware.js";
import { validate }      from "../middleware/validate.js";
import { saveMessageSchema, toggleSavedSchema } from "../schemas/aiSchemas.js";
import {
  getSessions,
  getSession,
  newSession,
  deleteSession,
  saveMessage,
  toggleSaved,
  getSaved,
} from "../controllers/chatController.js";

const router = Router();

// All chat routes require authentication
router.use(protect);

// Session management
router.get(    "/sessions",          getSessions);
router.get(    "/session/:sessionId", getSession);
router.post(   "/session/new",       newSession);
router.delete( "/session/:sessionId", deleteSession);

// Message persistence
router.post("/message/save",       validate(saveMessageSchema), saveMessage);

// Saved messages (renamed from bookmarks)
router.patch("/message/save-toggle", validate(toggleSavedSchema), toggleSaved);
router.get(  "/saved",               getSaved);

export default router;