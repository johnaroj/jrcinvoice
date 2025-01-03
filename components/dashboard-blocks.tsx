import { formatCurrency } from "@/app/utils/format-currency";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import prisma from "@/app/utils/db";
import requireUser from "@/app/hooks/requireUser";

async function getData(userId: string) {
  const [data, openInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
        currency: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);
  return {
    totalRevenue: data.reduce((acc, invoice) => acc + invoice.total, 0),
    totalInvoices: data.length,
    openInvoices: openInvoices.length,
    paidInvoices: paidInvoices.length,
  };
}

export async function DashboardBlocks() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <div className="grid gapd-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">
            {formatCurrency({
              amount: data.totalRevenue,
              currency: "EUR",
            })}
          </h2>
          <p className="text-xs text-muted-foreground">Based on total volume</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Total Invoices Issued
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{data.totalInvoices}</h2>
          <p className="text-xs text-muted-foreground">Total invoices issued</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{data.paidInvoices}</h2>
          <p className="text-xs text-muted-foreground">
            Total invoices that have been paid
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Pending Invoices
          </CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{data.openInvoices}</h2>
          <p className="text-xs text-muted-foreground">
            Total Invoices that are currently pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
