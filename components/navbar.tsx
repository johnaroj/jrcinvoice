import Link from "next/link";
import { Banknote } from "lucide-react";

import { RainbowButton } from "./ui/rainbow-button";

export function Navbar() {
  return (
    <div className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-x-1">
        <div
          className="flex items-center justify-center rounded-md p-1.5"
          style={{
            background:
              "radial-gradient(circle at top center, #3b82f6, #1e40af)",
          }}
        >
          <Banknote className="size-6 text-white" />
        </div>
        <div className="text-2xl font-bold gap-x-1">
          JRC<span className="text-blue-500">Invoice</span>
        </div>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href="/login">
          <RainbowButton>Get Started</RainbowButton>
        </Link>
      </div>
    </div>
  );
}
