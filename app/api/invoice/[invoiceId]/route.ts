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
      total: true,
      notes: true,
      items: true,
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

  // Set font
  pdf.setFont("helvetica");
  pdf.setFontSize(24);
  pdf.text(invoice.invoiceName, 20, 20);

  // From section
  pdf.setFontSize(12);
  pdf.text("From:", 20, 40);
  pdf.setFontSize(10);
  pdf.text([invoice.fromName, invoice.fromAddress, invoice.fromEmail], 20, 45);

  // Client section
  pdf.setFontSize(12);
  pdf.text("Bill to:", 20, 70);
  pdf.setFontSize(10);
  pdf.text(
    [invoice.clientName, invoice.clientEmail, invoice.clientAddress],
    20,
    75
  );

  // Invoice details
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

  // Table headers
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Total", 160, 100);
  pdf.line(20, 102, 190, 102);

  // Add items dynamically
  pdf.setFont("helvetica", "normal");
  let currentY = 110;
  invoice.items.forEach((item) => {
    pdf.text(item.description, 20, currentY);
    pdf.text(item.quantity.toString(), 100, currentY);
    pdf.text(
      formatCurrency({
        amount: item.rate,
        currency: invoice.currency as "USD" | "EUR",
      }),
      130,
      currentY
    );
    pdf.text(
      formatCurrency({
        amount: item.quantity * item.rate,
        currency: invoice.currency as "USD" | "EUR",
      }),
      160,
      currentY
    );
    currentY += 10; // Move to the next line for the next item
  });

  // Total section
  currentY += 10; // Add some space after the items
  pdf.line(20, currentY, 190, currentY);
  currentY += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total (${invoice.currency})`, 130, currentY);
  pdf.text(
    formatCurrency({
      amount: invoice.total,
      currency: invoice.currency as "USD" | "EUR",
    }),
    160,
    currentY
  );

  // Notes section
  if (invoice.notes) {
    currentY += 10;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Notes:", 20, currentY);
    pdf.text(invoice.notes, 20, currentY + 5);
  }

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  // Return PDF as a file
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceName}.pdf"`,
    },
  });
}
