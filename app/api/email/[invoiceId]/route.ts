import requireUser from "@/app/hooks/requireUser";
import prisma from "@/app/utils/db";
import { sendEmail } from "@/app/utils/nodemailer";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await requireUser();
    const invoiceId = (await params).invoiceId;
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId: session?.user?.id },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await sendEmail(
      invoice.clientEmail,
      "Reminder Invoice Payment",
      "invoice-payment-overdue",
      {
        clientName: invoice.clientName,
        contactLink: `${process.env.NEXT_PUBLIC_APP_URL}/api/invoice/${invoice.id}`,
      }
    );
    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "failed to send email" },
      { status: 500 }
    );
  }
}
