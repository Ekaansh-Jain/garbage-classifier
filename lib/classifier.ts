export type ModelType = "six" | "recycle" | "unified";

const CATEGORIES = [
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_TO_RECYCLE: Record<Category, "recyclable" | "non-recyclable"> = {
  cardboard: "recyclable",
  glass: "recyclable",
  metal: "recyclable",
  paper: "recyclable",
  plastic: "recyclable",
  trash: "non-recyclable",
};

const TIPS: Record<string, string> = {
  recyclable:
    "Rinse recyclables to remove food residue before placing them in the bin.",
  "non-recyclable":
    "Consider reusing or disposing of non-recyclables responsibly.",
  cardboard: "Flatten cardboard boxes to save space in the recycling bin.",
  glass: "Remove caps and rinse glass containers before recycling.",
  metal: "Clean metal cans and check local guidelines for aerosol cans.",
  paper: "Avoid recycling wet or heavily soiled paper.",
  plastic: "Check resin codes; not all plastics are accepted in every program.",
  trash:
    "If unsure, check your municipality’s waste guide to avoid contamination.",
};

function hashString(input: string): number {
  // Simple 32-bit FNV-1a hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash =
      (hash +
        ((hash << 1) +
          (hash << 4) +
          (hash << 7) +
          (hash << 8) +
          (hash << 24))) >>>
      0;
  }
  return hash >>> 0;
}

function pseudoRandom01(seed: number) {
  // xorshift*
  let x = seed || 123456789;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const u = (x >>> 0) / 4294967295;
  return u;
}

export function classifyMock(dataUrl: string, modelType: ModelType) {
  // Deterministic mock: hashes the dataUrl so repeated runs on same image produce the same result
  const h = hashString(dataUrl.slice(0, 2048));
  const r1 = pseudoRandom01(h);
  const r2 = pseudoRandom01(h ^ 0x9e3779b9);

  const catIdx = Math.floor(r1 * CATEGORIES.length) as number;
  const category =
    CATEGORIES[Math.min(Math.max(catIdx, 0), CATEGORIES.length - 1)];
  // Confidence skews higher for repeatability
  const categoryConfidence = Number((0.6 + 0.4 * r2).toFixed(2));

  const recycleLabel = CATEGORY_TO_RECYCLE[category];
  const recycleConfidence = Number((0.7 + 0.3 * (1 - r2)).toFixed(2));

  const tip =
    modelType === "recycle"
      ? TIPS[recycleLabel]
      : TIPS[category] ?? TIPS[recycleLabel];

  if (modelType === "recycle") {
    return {
      modelType,
      categoryPrediction: null,
      recyclePrediction: { label: recycleLabel, confidence: recycleConfidence },
      tip,
    };
  }

  return {
    modelType,
    categoryPrediction: { label: category, confidence: categoryConfidence },
    recyclePrediction: { label: recycleLabel, confidence: recycleConfidence },
    tip,
  };
}

export const ALL_CATEGORIES = [
  "cardboard",
  "glass",
  "metal",
  "paper",
  "plastic",
  "trash",
  "recyclable",
  "non-recyclable",
] as const;
export type UnifiedCategory = (typeof ALL_CATEGORIES)[number];

export function classifyUnified(dataUrl: string) {
  // Reuse deterministic signal and mapping from the previous mock
  const h = hashString(dataUrl.slice(0, 2048));
  const r1 = pseudoRandom01(h);
  const r2 = pseudoRandom01(h ^ 0x9e3779b9);

  const CATEGORIES = [
    "cardboard",
    "glass",
    "metal",
    "paper",
    "plastic",
    "trash",
  ] as const;
  const catIdx = Math.floor(r1 * CATEGORIES.length) as number;
  const category =
    CATEGORIES[Math.min(Math.max(catIdx, 0), CATEGORIES.length - 1)];
  const CATEGORY_TO_RECYCLE: Record<
    (typeof CATEGORIES)[number],
    "recyclable" | "non-recyclable"
  > = {
    cardboard: "recyclable",
    glass: "recyclable",
    metal: "recyclable",
    paper: "recyclable",
    plastic: "recyclable",
    trash: "non-recyclable",
  };

  const topRecycle = CATEGORY_TO_RECYCLE[category];
  const catConf = Number((0.6 + 0.4 * r2).toFixed(2)); // 0.6-1.0
  const recConf = Number((0.7 + 0.3 * (1 - r2)).toFixed(2)); // 0.7-1.0 inversely

  // Build unified scores. Give the selected category the highest score,
  // close ties for sibling categories, and a strong score for the mapped recyclability.
  const base = 0.15;
  const jitter = (k: number) =>
    Number((base + ((r1 * (k + 1)) % 0.1)).toFixed(2));
  const scores: Array<{ label: UnifiedCategory; confidence: number }> = [];

  // Material categories
  for (const c of CATEGORIES) {
    scores.push({
      label: c as UnifiedCategory,
      confidence: Number(
        (c === category ? catConf : jitter(c.charCodeAt(0))).toFixed(2)
      ),
    });
  }
  // Recyclable classes
  scores.push({
    label: "recyclable",
    confidence: topRecycle === "recyclable" ? recConf : jitter(1),
  });
  scores.push({
    label: "non-recyclable",
    confidence: topRecycle === "non-recyclable" ? recConf : jitter(2),
  });

  // Normalize to max 1.0 ceiling (cosmetic)
  for (const s of scores) s.confidence = Math.min(1, s.confidence);

  scores.sort((a, b) => b.confidence - a.confidence);
  const top = scores[0];
  const tip = TIPS[top.label] ?? TIPS[topRecycle];

  return {
    top, // { label, confidence }
    scores, // ranked list of all 8 classes
    tip,
  };
}
