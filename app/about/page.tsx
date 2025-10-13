import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-white to-green-50">
      <SiteHeader />
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white/90 shadow-lg p-8 md:p-10">
            <h1 className="text-balance text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-blue-600 to-teal-500">
              About
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              This minimalist app helps you classify waste quickly using either a
              six‑category model (cardboard, glass, metal, paper, plastic, trash)
              or a recyclable vs. non‑recyclable check. Use your webcam or upload
              a photo, then get a prediction with a confidence score and a helpful
              tip.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="p-3 rounded-lg bg-green-50/60 border border-green-100">
                <h3 className="font-semibold">Fast</h3>
                <p className="text-sm text-muted-foreground">Get predictions in under a second for uploaded images.</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <h3 className="font-semibold">Privacy</h3>
                <p className="text-sm text-muted-foreground">All images stay in your session unless you choose to share them.</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50/60 border border-yellow-100">
                <h3 className="font-semibold">Extensible</h3>
                <p className="text-sm text-muted-foreground">Easily swap the mock classifier for a production model via the API route.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
