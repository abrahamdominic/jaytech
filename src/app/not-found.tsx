import Link from "next/link";
import { Home, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-primary/5" />
          <span className="relative text-8xl font-black text-primary/20">404</span>
        </div>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Search className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-secondary">Page Not Found</h1>
        <p className="mb-8 text-muted leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">
              <Zap className="h-4 w-4" />
              Our Services
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
