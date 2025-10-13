import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-primary/10 shadow-inner mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row rounded-t-2xl">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <Leaf className="size-4 text-green-500" />© {new Date().getFullYear()}{" "}
          Garbage Classifier
        </div>
        <p className="text-xs text-muted-foreground">
          Please follow local recycling guidelines.
        </p>
      </div>
    </footer>
  );
}
