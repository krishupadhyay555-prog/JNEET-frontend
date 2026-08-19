// ============================================================
//  JNEET+ AI — models/WMS.js
//  INTENTIONALLY EMPTY OF A MODEL DEFINITION.
//
//  WMS (Weakness Management System) data does NOT live in its own
//  collection. It's embedded directly on the User document, as
//  the `wmsData` array — see models/User.js's `wmsEntrySchema`.
//  That decision already existed in the codebase (the field was
//  there before this feature was built) — this file is kept as a
//  deliberate placeholder/note rather than a second, competing
//  model, to avoid two different systems both claiming to own
//  "weakness data" (which would silently desync).
//
//  If WMS data ever needs to become its own top-level collection
//  (e.g. if entries grow very large per student, or need to be
//  queried/reported on independently of the User document), that
//  would be a deliberate migration — not something to add here
//  quietly alongside the existing embedded array.
//
//  See: backend/controllers/wmsController.js (reads/writes
//  User.wmsData directly), backend/services/wmsScoringService.js
//  (status/score logic).
// ============================================================

export {};