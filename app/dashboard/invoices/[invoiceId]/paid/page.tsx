import { markAsPaidAction } from "@/app/actions";
import requireUser from "@/app/hooks/requireUser";
import prisma from "@/app/utils/db";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubmitButton from "@/components/ui/submit-button";
import PaidGif from "@/public/paid.webp";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Authorize(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: userId },
  });

  if (!invoice) {
    return redirect("/dashboard/invoices");
  }
}

export default async function PaidPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const session = await requireUser();
  await Authorize(invoiceId, session?.user?.id as string);

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Mark as Paid</CardTitle>
          <CardDescription>
            Are you sure you want to mark this invoice as paid?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={PaidGif}
            alt="Paid"
            width={100}
            height={100}
            className="w-full h-auto rounded-lg"
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/dashboard/invoices"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await markAsPaidAction(invoiceId);
            }}
          >
            <SubmitButton text="Mark as Paid!" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
