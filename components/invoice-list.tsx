import requireUser from "@/app/hooks/requireUser";
import { InvoiceActions } from "./invoice-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import prisma from "@/app/utils/db";
import { formatCurrency } from "@/app/utils/format-currency";
import { Badge } from "./ui/badge";
import { EmptyState } from "./empty-state";

type Invoice = {
  id: string;
  clientName: string;
  total: number;
  status: string;
  invoiceName: string;
  createdAt: Date;
  currency: string;
};

async function getData(userId: string) {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      clientName: true,
      total: true,
      status: true,
      invoiceName: true,
      createdAt: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
}

export async function InvoiceList() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  if (data.length === 0) {
    return (
      <EmptyState
        title="No invoices found"
        description="You don't have any invoices yet."
        buttonText="Create an invoice"
        buttonLink="/dashboard/invoices/create"
      />
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice: Invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>#{invoice.invoiceName}</TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>
              {formatCurrency({
                amount: invoice.total,
                currency: invoice.currency as "USD" | "EUR",
              })}
            </TableCell>
            <TableCell>
              <Badge
                variant={invoice.status === "PAID" ? "secondary" : "default"}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(invoice.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
