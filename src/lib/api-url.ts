/**
 * Base URL of the Express API (studio-space-server).
 *
 * Client components only get `NEXT_PUBLIC_*` variables from `.env`, so the
 * value falls back to the local server when the variable is not defined.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
