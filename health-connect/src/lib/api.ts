const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").trim();
export const API_BASE = rawApiUrl.replace(/\/+$/, "");
