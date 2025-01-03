import requireUser from "@/app/hooks/requireUser";
import prisma from "@/app/utils/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import WarningGif from "@/public/warning.gif";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submit-button";
import { deleteInvoice } from "@/app/actions";

async function Authorize(invoiceId: string, userId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: userId },
  });

  if (!invoice) {
    return redirect("/dashboard/invoices");
  }

  return true;
}

export default async function DeleteInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const session = await requireUser();
  const invoiceId = (await params).invoiceId;
  await Authorize(invoiceId, session.user?.id as string);

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>
            Are you sure you want to delete this invoice?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={WarningGif}
            alt="Warning"
            className="rounded-md w-full"
            width={100}
            height={100}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            href={"/dashboard/invoices"}
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteInvoice(invoiceId);
            }}
          >
            <SubmitButton text="Delete" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
