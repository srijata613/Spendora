import { inngest } from "../client";
import { db } from "@/lib/prisma";
import { sendEmail } from "@/actions/send-email";

export const billReminder = inngest.createFunction(
  { id: "bill-reminder" },
  { cron: "0 9 * * *" },
  async ({ step }) => {

    const upcomingBills = await db.transaction.findMany({
      where: {
        isRecurring: true,
        nextRecurringDate: {
          lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: true
      }
    });

    for (const bill of upcomingBills) {
      await sendEmail({
        to: bill.user.email,
        subject: "Upcoming Subscription Reminder",
        text: `${bill.description} will renew soon for $${bill.amount}`
      });
    }

    return { processed: upcomingBills.length };
  }
);