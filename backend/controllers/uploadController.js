// ============================================================
//  JNEET+ AI — controllers/uploadController.js
//  Accepts a base64 image (no multer/multipart needed — Cloudinary's
//  SDK uploads directly from a base64 data URI), returns the
//  hosted URL to save into a question's imageUrl field.
//  NOTE: no admin-role check exists yet in this codebase — this
//  endpoint just requires being logged in. Fine while only you use
//  it to build the question bank; if the app later has real
//  students who shouldn't be able to call this, an admin-only
//  guard should be added then.
// ============================================================

import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  try {
    const { imageBase64 } = req.body;

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: "jneet-questions",
      resource_type: "image",
    });

    return res.json({ success: true, url: result.secure_url });

  } catch (err) {
    next(err);
  }
};