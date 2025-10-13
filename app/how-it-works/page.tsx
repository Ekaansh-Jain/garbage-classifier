import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
export default function HowItWorksPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-white to-green-50">
      <SiteHeader />
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white/90 shadow-lg p-8 md:p-10">
            <h1 className="text-balance text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-blue-600 to-teal-500">
              How It Works
            </h1>

            <div className="mt-6 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-green-50/50">
                  <h3 className="font-semibold">1. Choose input</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Capture via webcam or upload an image.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-blue-50/50">
                  <h3 className="font-semibold">2. Select model</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pick “6 Categories” or “Recyclable” depending on the level
                    of detail you want.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-yellow-50/50">
                  <h3 className="font-semibold">3. Classify</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Press the Classify button to get predictions and a helpful
                    disposal tip.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-gray-50/50">
                  <h3 className="font-semibold">4. Try again</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use Reset to test another image. Recent history is kept in
                    session.
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Note: This demo uses a deterministic mock classifier so it works
                out‑of‑the‑box. You can integrate a production ML model in the
                API route when ready.
              </p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
