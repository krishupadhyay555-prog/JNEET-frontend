// ============================================================
//  JNEET+ AI — middleware/validate.js
//  Factory that returns an Express middleware for any Zod schema.
//  Usage: router.post("/register", validate(registerSchema), controller)
//
//  If validation fails, the request is terminated here with a
//  structured error response. The controller is never called.
//  Error shape is clean { field, message } — no Zod internals exposed.
// ============================================================

/**
 * @param {import("zod").ZodSchema} schema - The Zod schema to validate against
 * @returns {import("express").RequestHandler}
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Flatten Zod errors into a simple { field: firstMessage } map
    const raw = result.error.flatten().fieldErrors;

    // Build a clean array of { field, message } objects
    const fieldErrors = Object.entries(raw).map(([field, messages]) => ({
      field,
      message: messages[0], // Only the first error per field
    }));

    // The first error is also surfaced as the top-level `error` string
    // so the frontend can show a single message without iterating
    const firstError = fieldErrors[0]?.message || "Validation failed";

    return res.status(400).json({
      success:     false,
      error:       firstError,
      fieldErrors, // Full map for per-field inline errors on the frontend
    });
  }

  // Attach parsed (and type-coerced) data back to req.body
  // This means controllers always receive clean, typed data
  req.body = result.data;
  next();
};