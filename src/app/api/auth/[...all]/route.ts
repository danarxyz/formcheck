import { getAuth } from "@/auth/server";

// Lazily bound so `next build` does not need auth secrets.
export const GET = (request: Request) => getAuth().handler(request);
export const POST = (request: Request) => getAuth().handler(request);
