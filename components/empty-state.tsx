import { Ban, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export function EmptyState({
  title,
  description,
  buttonText,
  buttonLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full rounded-md border-2 border-dashed p-4 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center rounded-full bg-primary/10 p-2 size-20">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
        {description}
      </p>
      <Link href={buttonLink} className={buttonVariants()}>
        <Plus className="size-4 mr-2" />
        {buttonText}
      </Link>
    </div>
  );
}
