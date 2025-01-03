import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <Card className="w-[380px] px-5">
        <CardHeader className="text-center">
          <div className=" mb-4 flex size-20 items-center justify-center bg-blue-100 rounded-full mx-auto">
            <Mail className="size-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Verify your email
          </CardTitle>
          <CardDescription>
            Please check your email for a verification link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 rounded-md bg-yellow-50 border-yellow-500 border-2 p-4">
            <div className="flex items-center gap-x-2">
              <AlertCircle className="size-5 text-yellow-500" />
              <p className="text-sm font-medium text-yellow-800">
                If you didn &apos;t receive the email, please check your spam
                folder.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full",
            })}
          >
            <ArrowLeft className="size-4 mr-2 " />
            Back to homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
