import "server-only";

import { Resend } from "resend";

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY. Add it to .env.local.");
  }
  return new Resend(apiKey);
}
