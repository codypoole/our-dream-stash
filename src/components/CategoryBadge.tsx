import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

// Generate a stable color slot from a string name
const COLOR_SLOTS = [
  { bg: "bg-[hsl(222_48%_18%)]", text: "text-[hsl(222_72%_75%)]" },   // blue
  { bg: "bg-[hsl(35_52%_18%)]",  text: "text-[hsl(35_72%_72%)]" },    // amber
  { bg: "bg-[hsl(322_38%_18%)]", text: "text-[hsl(322_62%_78%)]" },   // pink
  { bg: "bg-[hsl(155_34%_16%)]", text: "text-[hsl(155_52%_65%)]" },   // green
  { bg: "bg-[hsl(22_50%_18%)]",  text: "text-[hsl(22_72%_70%)]" },    // orange
  { bg: "bg-[hsl(200_42%_16%)]", text: "text-[hsl(200_62%_68%)]" },   // teal
  { bg: "bg-[hsl(270_28%_18%)]", text: "text-[hsl(270_52%_72%)]" },   // purple
];

function getCategorySlot(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return COLOR_SLOTS[hash % COLOR_SLOTS.length];
}

export function CategoryBadge({ category, size = "sm" }: { category: string; size?: "sm" | "md" }) {
  const { categories } = useCategories();
  const cat = categories.find((c) => c.name === category);
  const emoji = cat?.emoji || "✨";
  const slot = getCategorySlot(category);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold",
        slot.bg, slot.text,
        size === "sm" ? "px-2.5 py-0.5 text-[10px] tracking-wide" : "px-3 py-1 text-xs"
      )}
    >
      <span className="text-[11px]">{emoji}</span>
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
        const slot = cat === "All" ? null : getCategorySlot(cat);
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200",
              selected === cat
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.03]"
                : "bg-card/70 text-muted-foreground hover:text-foreground border border-border/50 hover:border-border"
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
