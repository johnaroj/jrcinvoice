import { DashboardBlocks } from "@/components/dashboard-blocks";

import { InvoiceGraph } from "@/components/invoice-graph";
import { RecentInvoices } from "@/components/recent-invoices";
import prisma from "../utils/db";
import requireUser from "../hooks/requireUser";
import { EmptyState } from "@/components/empty-state";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
  return data;
}

export default async function Dashboard() {
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
    <div className="flex flex-col gap-4 md:gap-8">
      <Suspense
        fallback={
          <Skeleton className="w-full h-full flex-1 max-w-4xl mx-auto" />
        }
      >
        <DashboardBlocks />
        <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
          <div className="lg:col-span-2">
            <InvoiceGraph />
          </div>
          <div className="lg:col-span-1">
            <RecentInvoices />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
