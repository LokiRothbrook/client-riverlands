import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:py-32">
        <svg
          className="mb-8 h-24 w-64 opacity-20"
          viewBox="0 0 256 96"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 40 C32 25, 64 55, 96 40 S160 25, 192 40 S256 55, 288 40"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-primary"
          />
          <path
            d="M0 56 C32 41, 64 71, 96 56 S160 41, 192 56 S256 71, 288 56"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          />
        </svg>

        <h1 className="text-6xl font-bold text-primary sm:text-8xl">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Lost on the River
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
          Looks like you&apos;ve drifted off course. The page you&apos;re
          looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/explore">Explore the Region</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
