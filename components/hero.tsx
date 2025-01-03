import Link from "next/link";
import { RainbowButton } from "./ui/rainbow-button";
import Image from "next/image";
import heroImage from "@/public/hero-image.png";
export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-12 lg:py-20">
      <div className="text-center">
        <span className="text-sm text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full">
          Welcome to JRCInvoice 1.0
        </span>
        <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight">
          invoicing made
          <span
            className="bg-gradient-to-l from-blue-500 via-teal-500 to-green-500  px-4 py-2  block -mt-2
          text-transparent bg-clip-text"
          >
            super easy!
          </span>
        </h1>
        <p className="max-w-xl mx-auto mt-4 lg:text-lg text-muted-foreground">
          Creating Invoices is now easier than ever. JRCInvoice is a simple and
          intuitive platform that allows you to create, manage, and send
          invoices with ease.
        </p>
        <div className="mt-8 mb-12">
          <Link href="/login">
            <RainbowButton>Get Started</RainbowButton>
          </Link>
        </div>
      </div>
      <div className="relative items-center w-full py-12 mx-auto mt-12">
        <svg
          className="absolute inset-0 -mt-24 blur-3xl"
          style={{ zIndex: -1 }}
          fill="none"
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_10_20)">
            <g filter="url(#filter0_f_10_20)">
              <path d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z" fill="#03FFE0" />
              <path
                d="M0 322.2V400H240H320L106 134.75L0 322.2Z"
                fill="#7C87F8"
              />
              <path
                d="M320 400H400V78.75L106.2 134.75L320 400Z"
                fill="#4C65E4"
              />
              <path d="M400 0H128.6L106.2 134.75L400 78.75V0Z" fill="#043AFF" />
            </g>
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="720.666"
              id="filter0_f_10_20"
              width="720.666"
              x="-160.333"
              y="-160.333"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
                mode="normal"
              />
              <feGaussianBlur
                stdDeviation="80.1666"
                result="effect1_foregroundBlur_10_20"
              />
            </filter>
          </defs>
        </svg>
        <Image
          src={heroImage}
          alt="Hero Image"
          className="relative object-cover w-full border rounded-lg lg:rounded-2xl shadow-2xl"
        />
      </div>
    </section>
  );
}
