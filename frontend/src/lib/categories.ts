import type { Category } from "@t2t/shared";

// Visual metadata for rich category labels.
export const CATEGORY_META: Record<Category, { emoji: string; chip: string; bar: string }> = {
  organic: { emoji: "🍎", chip: "bg-green-100 text-green-800", bar: "bg-green-500" },
  plastic: { emoji: "🧴", chip: "bg-sky-100 text-sky-800", bar: "bg-sky-500" },
  paper: { emoji: "📄", chip: "bg-yellow-100 text-yellow-800", bar: "bg-yellow-500" },
  cardboard: { emoji: "📦", chip: "bg-amber-100 text-amber-900", bar: "bg-amber-500" },
  metal: { emoji: "🥫", chip: "bg-slate-200 text-slate-800", bar: "bg-slate-500" },
  glass: { emoji: "🍾", chip: "bg-teal-100 text-teal-800", bar: "bg-teal-500" },
  ewaste: { emoji: "🔌", chip: "bg-rose-100 text-rose-800", bar: "bg-rose-500" },
  trash: { emoji: "🗑️", chip: "bg-gray-200 text-gray-800", bar: "bg-gray-500" },
};
