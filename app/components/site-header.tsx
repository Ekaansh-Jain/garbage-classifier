import Link from "next/link";

import { Recycle } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-lg shadow-md border-b border-primary/10">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-xl text-green-700 tracking-tight hover:opacity-90 transition"
        >
          <Recycle className="size-6 text-green-600 drop-shadow" />
          Garbage Classifier
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-6 text-base text-muted-foreground font-medium"
        >
          <Link
            href="/"
            className="hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full px-3 py-1 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full px-3 py-1 transition"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full px-3 py-1 transition"
          >
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
}
