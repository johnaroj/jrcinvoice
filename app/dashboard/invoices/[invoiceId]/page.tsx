import requireUser from "@/app/hooks/requireUser";
import prisma from "@/app/utils/db";
import { EditInvoice } from "@/components/edit-invoice";
import { notFound } from "next/navigation";

async function getInvoice(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      userId: userId,
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });

  if (!invoice) {
    return notFound();
  }

  return invoice;
}

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const session = await requireUser();
  const invoice = await getInvoice(
    (
      await params
    ).invoiceId,
    session.user?.id as string
  );
  return <EditInvoice data={invoice} />;
}
