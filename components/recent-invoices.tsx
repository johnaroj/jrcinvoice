import prisma from "@/app/utils/db";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import requireUser from "@/app/hooks/requireUser";
import { formatCurrency } from "@/app/utils/format-currency";

async function getInvoices(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  return data;
}

type Invoice = {
  id: string;
  clientName: string;
  clientEmail: string;
  total: number;
  currency: string;
};
export async function RecentInvoices() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-8">
        {data.map((invoice: Invoice) => (
          <div key={invoice.id} className="flex items-center gap-4">
            <Avatar className="hidden sm:flex size-9">
              <AvatarFallback>
                {(() => {
                  const names = invoice.clientName.split(" ");
                  if (names.length > 1) {
                    // Use the first letter of both first and last names
                    return `${names[0][0]}${names[1][0]}`.toUpperCase();
                  } else {
                    // Use the first two letters of the single name
                    return names[0].slice(0, 2).toUpperCase();
                  }
                })()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">
                {invoice.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {invoice.clientEmail}
              </p>
            </div>
            <div className="ml-auto">
              {formatCurrency({
                amount: invoice.total,
                currency: invoice.currency as "USD" | "EUR",
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
