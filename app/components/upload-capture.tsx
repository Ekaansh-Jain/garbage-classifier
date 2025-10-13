import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Garbage Classifier
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
}
