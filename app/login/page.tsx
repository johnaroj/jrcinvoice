import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "../utils/auth";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/ui/submit-button";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,theme(colors.gray.200)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.gray.200)_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,theme(colors.gray.800)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.gray.800)_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,theme(colors.blue.200),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,theme(colors.blue.900),transparent)]"></div>
      </div>
      <div className="flex px-4 items-center justify-center h-screen w-full">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Please enter your email and password to login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData) => {
                "use server";
                await signIn("nodemailer", formData);
              }}
              className="flex flex-col gap-y-4"
            >
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                />
              </div>
              <SubmitButton text="Login" />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
