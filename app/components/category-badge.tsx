"use client";

import { Badge } from "@/components/ui/badge";
import type { UnifiedLabel } from "@/lib/classifier";
import {
  Recycle,
  Trash2,
  Package,
  GlassWater,
  Newspaper,
  Box,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<UnifiedLabel, LucideIcon> = {
  cardboard: Box,
  glass: GlassWater,
  metal: Package,
  paper: Newspaper,
  plastic: Package,
  trash: Trash2,
  Recyclable: Recycle,
  "non Recyclable": Trash2,
};

export function CategoryBadge({
  label,
  muted,
  percent,
}: {
  label: UnifiedLabel;
  muted?: boolean;
  percent?: number;
}) {
  const Icon = iconMap[label];
  return (
    <Badge
      variant={muted ? "outline" : "secondary"}
      className="gap-1 rounded-full px-3 py-1.5 text-sm"
      aria-label={`${label}${
        percent != null ? ` ${Math.round(percent * 100)}%` : ""
      }`}
      title={label}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="capitalize">{label}</span>
      {percent != null ? (
        <span className="text-muted-foreground">
          · {Math.round(percent * 100)}%
        </span>
      ) : null}
    </Badge>
  );
}
