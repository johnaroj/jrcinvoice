import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatCurrency } from "@/app/utils/format-currency";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: (await params).invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromAddress: true,
      fromEmail: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      total: true,
      notes: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  //set font
  pdf.setFont("helvetica");
  pdf.setFontSize(24);
  pdf.text(invoice.invoiceName, 20, 20);

  //from section
  pdf.setFontSize(12);
  pdf.text("From:", 20, 40);
  pdf.setFontSize(10);
  pdf.text([invoice.fromName, invoice.fromAddress, invoice.fromEmail], 20, 45);

  //client section
  pdf.setFontSize(12);
  pdf.text("Bill to:", 20, 70);
  pdf.setFontSize(10);
  pdf.text(
    [invoice.clientName, invoice.clientEmail, invoice.clientAddress],
    20,
    75
  );

  //invoice details
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: #${invoice.invoiceNumber}`, 120, 40);
  pdf.text(
    `Date: ${new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date(invoice.date))}`,
    120,
    45
  );
  pdf.text(`Due Date: Net ${invoice.dueDate} days`, 120, 50);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Total", 160, 100);

  pdf.line(20, 102, 190, 102);
  pdf.setFont("helvetica", "normal");
  pdf.text(invoice.invoiceItemDescription, 20, 110);
  pdf.text(invoice.invoiceItemQuantity.toString(), 100, 110);
  pdf.text(
    formatCurrency({
      amount: invoice.invoiceItemRate,
      currency: invoice.currency as "USD" | "EUR",
    }),
    130,
    110
  );
  pdf.text(
    formatCurrency({
      amount: invoice.total,
      currency: invoice.currency as "USD" | "EUR",
    }),
    160,
    110
  );

  //Total section
  pdf.line(20, 115, 190, 115);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total (${invoice.currency})`, 130, 130);
  pdf.text(
    formatCurrency({
      amount: invoice.total,
      currency: invoice.currency as "USD" | "EUR",
    }),
    160,
    130
  );
  if (invoice.notes) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Notes:", 20, 140);
    pdf.text(invoice.notes, 20, 145);
  }

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  //return pdf as a file
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=" + invoice.invoiceName,
    },
  });
}
