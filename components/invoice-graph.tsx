import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import prisma from "@/app/utils/db";
import { format, parse } from "date-fns";
import requireUser from "@/app/hooks/requireUser";
import { Graph } from "./graph";

async function getInvoices(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const aggregatedData = rawData.reduce(
    (
      acc: { [key: string]: number },
      curr: { createdAt: Date; total: number }
    ) => {
      const date = format(curr.createdAt, "MMM dd");
      acc[date] = (acc[date] || 0) + curr.total;
      return acc;
    },
    {}
  ) as { [key: string]: number };

  return Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: parse(date, "dd-MMM-yyyy", new Date()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({ date, amount }));
}

export async function InvoiceGraph() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          This is a graph of the paid invoices for the past 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
}
