import { z } from "zod";

export const contactSchema = z.object({
  name:    z.string().trim().min(1, "Please enter your name.").max(80, "Name is too long."),
  email:   z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
  topic:   z.enum(["general", "account", "payment", "bug", "content", "privacy", "grievance"], { required_error: "Pick a topic." }),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(2000, "Keep the message under 2000 characters."),
  captchaToken: z.string().max(4096).optional(),
}).strict();

export const updateSupportSchema = z.object({ status: z.enum(["open", "closed"]) }).strict();
