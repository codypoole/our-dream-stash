import { DEFAULT_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColorMap: Record<string, string> = {
  Electronics: "bg-[hsl(var(--tag-electronics))] text-[hsl(var(--tag-electronics-fg))]",
  Home: "bg-[hsl(var(--tag-home))] text-[hsl(var(--tag-home-fg))]",
  Clothing: "bg-[hsl(var(--tag-clothing))] text-[hsl(var(--tag-clothing-fg))]",
  Books: "bg-[hsl(var(--tag-books))] text-[hsl(var(--tag-books-fg))]",
  Kitchen: "bg-[hsl(var(--tag-kitchen))] text-[hsl(var(--tag-kitchen-fg))]",
  Travel: "bg-[hsl(var(--tag-travel))] text-[hsl(var(--tag-travel-fg))]",
  Other: "bg-[hsl(var(--tag-other))] text-[hsl(var(--tag-other-fg))]",
};

const categoryEmojis: Record<string, string> = {
  Electronics: "⚡",
  Home: "🏠",
  Clothing: "👗",
  Books: "📚",
  Kitchen: "🍳",
  Travel: "✈️",
  Other: "✨",
};

export function CategoryBadge({ category, size = "sm" }: { category: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        categoryColorMap[category] || categoryColorMap.Other,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span>{categoryEmojis[category] || "✨"}</span>
      {category}
    </span>
  );
}

export function CategoryFilter({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (cat: string) => void;
}) {
  const categories = ["All", ...DEFAULT_CATEGORIES];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
            selected === cat
              ? "bg-primary text-primary-foreground shadow-sm scale-105"
              : "bg-card text-muted-foreground hover:bg-secondary border border-border"
          )}
        >
          {cat !== "All" && (
            <span className="mr-1">{categoryEmojis[cat] || "✨"}</span>
          )}
          {cat}
        </button>
      ))}
    </div>
  );
}
