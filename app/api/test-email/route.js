import { Resend } from "resend";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const data = await resend.emails.send({
    from: "Spendora <onboarding@resend.dev>",
    to: "sinnath.moitra@gmail.com",
    subject: "Test Email",
    html: "<h1>Hello from Spendora</h1>",
  });

  return Response.json(data);
}