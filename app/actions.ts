"use server";

import requireUser from "./hooks/requireUser";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zod-schemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { sendEmail } from "./utils/nodemailer";
import { formatCurrency } from "./utils/format-currency";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { firstName, lastName, address } = submission.value;

  await prisma.user.update({
    where: { id: session?.user?.id },
    data: {
      firstName,
      lastName,
      address,
    },
  });

  redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      invoiceName: submission.value.invoiceName,
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceNumber: submission.value.invoiceNumber,
      total: submission.value.total,
      notes: submission.value.notes,
      status: submission.value.status,
      items: {
        createMany: {
          data: submission.value.items.map((item) => ({
            ...item,
          })),
        },
      },
      user: {
        connect: {
          id: session?.user?.id,
        },
      },
    },
  });

  await sendEmail(
    submission.value.clientEmail,
    "Your Invoice is Ready",
    "invoice",
    {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber.toString(),
      dueDate: format(
        new Date(submission.value.date).setDate(
          new Date(submission.value.date).getDate() + submission.value.dueDate
        ),
        "MMM dd, yyyy"
      ),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as "USD" | "EUR",
      }),
      downloadLink: `${process.env.NEXT_PUBLIC_APP_URL}/api/invoice/${data.id}`,
    }
  );

  return redirect("/dashboard/invoices");
}

export async function updateInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  await prisma.invoice.update({
    where: { id: formData.get("id") as string, userId: session?.user?.id },
    data: {
      ...submission.value,
      user: {
        connect: {
          id: session?.user?.id,
        },
      },
      items: {
        upsert: submission.value.items.map((item) => ({
          where: { id: item.id ?? "dummy-id" }, // Use a dummy ID if itemId is not present
          create: {
            description: item.description,
            rate: item.rate,
            quantity: item.quantity,
          },
          update: {
            description: item.description,
            rate: item.rate,
            quantity: item.quantity,
          },
        })),
        deleteMany: {
          id: {
            in: submission.value.items
              .map((item) => item.id)
              .filter((id): id is string => id !== undefined),
          },
        },
      },
    },
  });

  await sendEmail(
    submission.value.clientEmail,
    "Your Invoice is Updated",
    "update-invoice",
    {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber.toString(),
      dueDate: format(
        new Date(submission.value.date).setDate(
          new Date(submission.value.date).getDate() + submission.value.dueDate
        ),
        "MMM dd, yyyy"
      ),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as "USD" | "EUR",
      }),
      downloadLink: `${
        process.env.NEXT_PUBLIC_APP_URL
      }/api/invoice/${formData.get("id")}`,
    }
  );
  return redirect("/dashboard/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  const session = await requireUser();

  await prisma.invoice.delete({
    where: { id: invoiceId, userId: session?.user?.id },
  });

  return redirect("/dashboard/invoices");
}

export async function markAsPaidAction(invoiceId: string) {
  const session = await requireUser();

  await prisma.invoice.update({
    where: { id: invoiceId, userId: session?.user?.id },
    data: { status: "PAID" },
  });

  return redirect("/dashboard/invoices");
}
