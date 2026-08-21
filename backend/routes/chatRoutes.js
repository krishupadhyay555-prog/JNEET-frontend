// ============================================================
//  JNEET+ AI — routes/chatRoutes.js  (v3 — rename + pin routes)
//  ADDED: PATCH /session/:sessionId/rename, PATCH /session/:sessionId/pin.
//  Everything else UNCHANGED.
// ============================================================
import { Router }  from "express";
import { protect }       from "../middleware/authMiddleware.js";
import { validate }      from "../middleware/validate.js";
import { saveMessageSchema, toggleSavedSchema } from "../schemas/aiSchemas.js";
import { renameSessionSchema } from "../schemas/chatSchemas.js";
import {
  getSessions,
  getSession,
  newSession,
  setActiveSession,
  deleteSession,
  renameSession,
  toggleSessionPin,
  saveMessage,
  toggleSaved,
  getSaved,
  searchChats,
} from "../controllers/chatController.js";

const router = Router();

router.use(protect);

router.get(    "/sessions",                    getSessions);
router.get(    "/search",                      searchChats);
router.get(    "/session/:sessionId",          getSession);
router.post(   "/session/new",                 newSession);
router.patch(  "/session/:sessionId/activate", setActiveSession);
router.patch(  "/session/:sessionId/rename",   validate(renameSessionSchema), renameSession);
router.patch(  "/session/:sessionId/pin",      toggleSessionPin);
router.delete( "/session/:sessionId",          deleteSession);

router.post("/message/save",       validate(saveMessageSchema), saveMessage);

router.patch("/message/save-toggle", validate(toggleSavedSchema), toggleSaved);
router.get(  "/saved",               getSaved);

export default router;