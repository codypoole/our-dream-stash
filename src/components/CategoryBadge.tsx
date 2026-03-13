import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

export function CategoryBadge({ category, size = "sm" }: { category: string; size?: "sm" | "md" }) {
  const { categories } = useCategories();
  const cat = categories.find((c) => c.name === category);
  const emoji = cat?.emoji || "✨";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium bg-muted text-muted-foreground",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span>{emoji}</span>
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
  const { visibleCategories } = useCategories();
  const allOptions = ["All", ...visibleCategories.map((c) => c.name)];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {allOptions.map((cat) => {
        const catObj = visibleCategories.find((c) => c.name === cat);
        return (
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
            {catObj && <span className="mr-1">{catObj.emoji}</span>}
            {cat}
          </button>
        );
      })}
    </div>
  );
}
