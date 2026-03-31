import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

export function CategoryBadge({ category, size = "sm" }: { category: string; size?: "sm" | "md" }) {
  const { categories } = useCategories();
  const cat = categories.find((c) => c.name === category);
  const emoji = cat?.emoji || "✨";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold bg-muted/80 text-muted-foreground",
        size === "sm" ? "px-2.5 py-0.5 text-[11px] tracking-wide" : "px-3 py-1 text-sm"
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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {allOptions.map((cat) => {
        const catObj = visibleCategories.find((c) => c.name === cat);
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200",
              selected === cat
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]"
                : "bg-card text-muted-foreground hover:text-foreground border border-border/60 hover:border-foreground/20"
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
