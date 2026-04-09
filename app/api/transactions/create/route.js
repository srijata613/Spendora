import { aj } from "@/lib/security/arcjet";

export async function POST(req) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return new Response("Blocked", { status: 403 });
  }

  const body = await req.json();

  // normal logic here

  return Response.json({ success: true });
}