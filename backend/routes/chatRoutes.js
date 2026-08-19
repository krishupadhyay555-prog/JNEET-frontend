// ============================================================
//  JNEET+ AI — routes/chatRoutes.js  (v2.2 — search route added)
//  ADDED: GET /search — full-content chat search.
//  Everything else UNCHANGED.
// ============================================================
import { Router }  from "express";
import { protect }       from "../middleware/authMiddleware.js";
import { validate }      from "../middleware/validate.js";
import { saveMessageSchema, toggleSavedSchema } from "../schemas/aiSchemas.js";
import {
  getSessions,
  getSession,
  newSession,
  setActiveSession,
  deleteSession,
  saveMessage,
  toggleSaved,
  getSaved,
  searchChats,
} from "../controllers/chatController.js";
const router = Router();
// All chat routes require authentication
router.use(protect);
// Session management
router.get(    "/sessions",                 getSessions);
router.get(    "/search",                   searchChats);
router.get(    "/session/:sessionId",       getSession);
router.post(   "/session/new",              newSession);
router.patch(  "/session/:sessionId/activate", setActiveSession);
router.delete( "/session/:sessionId",       deleteSession);
// Message persistence
router.post("/message/save",       validate(saveMessageSchema), saveMessage);
// Saved messages
router.patch("/message/save-toggle", validate(toggleSavedSchema), toggleSaved);
router.get(  "/saved",               getSaved);
export default router;