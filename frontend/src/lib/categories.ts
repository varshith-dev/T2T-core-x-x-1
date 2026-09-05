import type { Category } from "@t2t/shared";

// Visual metadata for category labels (no emojis — a colored dot + chip).
export const CATEGORY_META: Record<Category, { dot: string; chip: string; bar: string }> = {
  organic: { dot: "bg-green-500", chip: "bg-green-100 text-green-800", bar: "bg-green-500" },
  plastic: { dot: "bg-sky-500", chip: "bg-sky-100 text-sky-800", bar: "bg-sky-500" },
  paper: { dot: "bg-yellow-500", chip: "bg-yellow-100 text-yellow-800", bar: "bg-yellow-500" },
  cardboard: { dot: "bg-amber-500", chip: "bg-amber-100 text-amber-900", bar: "bg-amber-500" },
  metal: { dot: "bg-slate-500", chip: "bg-slate-200 text-slate-800", bar: "bg-slate-500" },
  glass: { dot: "bg-teal-500", chip: "bg-teal-100 text-teal-800", bar: "bg-teal-500" },
  ewaste: { dot: "bg-rose-500", chip: "bg-rose-100 text-rose-800", bar: "bg-rose-500" },
  trash: { dot: "bg-gray-500", chip: "bg-gray-200 text-gray-800", bar: "bg-gray-500" },
};
