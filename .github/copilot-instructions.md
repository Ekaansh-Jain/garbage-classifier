# Copilot Instructions for Garbage Classifier (Next.js)

## Project Overview

- **Type:** Next.js 15 app directory project (TypeScript, React, TailwindCSS)
- **Purpose:** Classifies images of waste into 8 unified categories (cardboard, glass, metal, paper, plastic, trash, recyclable, non-recyclable) using a deterministic mock classifier. Designed for easy ML model integration.

## Key Architecture

- **Frontend:**
  - Main UI in `app/page.tsx` (image upload, webcam, preview, classification, history)
  - UI components in `components/ui/` and `app/components/`
  - State and logic handled with React hooks; toast notifications via `sonner`
- **API:**
  - `/api/classify` endpoint (`app/api/classify/route.ts`) receives base64 image, returns prediction from `classifyUnified` in `lib/classifier.ts`
- **Classifier Logic:**
  - `lib/classifier.ts` (and `app/lib/classifier.ts`): deterministic mock, easy to swap for real ML
  - Returns top prediction, confidence scores for all classes, and a disposal tip

## Developer Workflows

- **Start dev server:** `npm run dev` (see `package.json`)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (uses Next.js + TypeScript ESLint config)
- **No built-in test scripts** (add as needed)
- **Styling:** TailwindCSS (see `app/globals.css`, `postcss.config.mjs`)
- **Component Aliases:**
  - `@/components`, `@/lib`, `@/hooks`, etc. (see `components.json`)

## Project Conventions & Patterns

- **App Directory Routing:** All pages/components under `app/` (Next.js 13+)
- **TypeScript everywhere** (strict mode)
- **UI Components:**
  - Use `cn` from `lib/utils.ts` for className merging
  - Use `components/ui/` for base UI, `app/components/` for app-specific
- **Mock Classifier:**
  - Deterministic: same image always yields same result (see `classifyUnified`)
  - To integrate a real ML model, replace logic in `lib/classifier.ts` and update API route
- **History:**
  - Recent classifications stored in React state (not persisted)
- **Tips:**
  - Disposal tips mapped to each category in classifier logic

## Integration Points

- **ML Model:** Replace `classifyUnified` in `lib/classifier.ts` and update `/api/classify` route
- **UI:** Extend or override components in `components/ui/` or `app/components/`
- **Styling:** Use Tailwind utility classes; color palette in `app/globals.css`

## Examples

- **API usage:** See `app/api/classify/route.ts` for how images are processed and predictions returned
- **Component usage:** See `app/page.tsx` for how UI components and classifier are wired together

## References

- [README.md](../README.md) for getting started
- [How it Works](app/how-it-works/page.tsx) for user flow

---

**For AI agents:**

- Use provided component aliases for imports
- Follow the deterministic mock pattern for classifier unless integrating a real model
- Keep UI consistent with Tailwind and existing component structure
- When adding new features, prefer colocating logic in `app/` or `lib/` as appropriate
