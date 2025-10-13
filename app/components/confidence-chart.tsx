"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
} from "recharts";
import { cn } from "@/lib/utils";

type Score = { label: string; confidence: number };

const COLOR_MAP: Record<string, string> = {
  cardboard: "var(--color-chart-1)",
  glass: "var(--color-chart-2)",
  metal: "var(--color-chart-3)",
  paper: "var(--color-chart-4)",
  plastic: "var(--color-chart-5)",
  trash: "var(--color-chart-1)",
  recyclable: "var(--color-chart-2)",
  "non-recyclable": "var(--color-chart-3)",
};

function labelDisplay(label: string) {
  if (label === "non-recyclable") return "Non Recyclable";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-md border bg-popover p-2 text-xs text-popover-foreground shadow-sm">
      <div className="font-medium">{labelDisplay(p?.payload?.label)}</div>
      <div className="text-muted-foreground">
        {Math.round((p?.payload?.confidence ?? 0) * 100)}%
      </div>
    </div>
  );
}

export function ConfidenceChart({
  scores,
  className,
}: {
  scores: Score[];
  className?: string;
}) {
  const data = scores.map((s) => ({
    ...s,
    pct: Math.round(s.confidence * 100),
    fill: COLOR_MAP[s.label] ?? "var(--color-chart-1)",
    x: labelDisplay(s.label),
  }));

  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="x" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <RTooltip content={<CustomTooltip />} />
          <Bar dataKey="pct" radius={[6, 6, 0, 0]} fillOpacity={0.9}>
            {data.map((entry, index) => (
              <rect key={`bar-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
