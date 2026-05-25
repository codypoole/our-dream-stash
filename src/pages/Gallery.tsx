import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishList } from "@/hooks/useWishList";
import { useCategories } from "@/hooks/useCategories";
import { WishDetailDrawer } from "@/components/WishDetailDrawer";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Gallery() {
  const { items, loading, togglePurchased, deleteItem, editItem, togglePriority, priorityCount, getPriorityItems } = useWishList();
  const { visibleCategories } = useCategories();
  const [filterCategory, setFilterCategory] = useState("All");
  const [detailItemId, setDetailItemId] = useState<string | null>(null);

  const handlePriority = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.priority) {
      togglePriority(id);
      return;
    }
    if (priorityCount < 5) {
      togglePriority(id);
    }
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (item.purchased) return false;
      if (!item.image) return false;
      if (filterCategory !== "All" && item.category !== filterCategory) return false;
      return true;
    });
  }, [items, filterCategory]);

  return (
    <div className="min-h-screen bg-background relative">
      <header
        className="sticky top-0 z-10 border-b border-border/40 bg-background/85 backdrop-blur-2xl"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
              <ImageIcon className="h-[17px] w-[17px] text-primary" />
            </div>
            <div>
              <p className="font-display text-[9px] font-semibold italic tracking-[0.22em] text-muted-foreground uppercase leading-none mb-0.5">
                our
              </p>
              <h1 className="font-display text-[1.1rem] font-bold text-foreground leading-none tracking-tight">
                Gallery
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-5 space-y-4 relative z-[1]">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["All", ...visibleCategories.map((c) => c.name)].map((cat) => {
            const catObj = visibleCategories.find((c) => c.name === cat);
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200",
                  filterCategory === cat
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

        {/* Photo grid */}
        <div className="pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <p className="text-sm text-muted-foreground">Loading gallery...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <span className="text-3xl">📷</span>
              </div>
              <p className="font-display text-lg font-bold text-foreground mb-1.5">
                No photos yet
              </p>
              <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                Add photos to your wishes to see them here.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-3 gap-1.5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => setDetailItemId(item.id)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border/40 bg-muted shadow-sm shadow-black/20 transition-all duration-200 hover:shadow-md hover:border-border/70 hover:scale-[1.02]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 pt-6">
                      <p className="text-[11px] font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                        {item.name}
                      </p>
                      {item.estimatedCost != null && (
                        <p className="text-[10px] font-bold text-white/70 mt-0.5 drop-shadow-md">
                          ${item.estimatedCost.toFixed(0)}
                        </p>
                      )}
                    </div>
                    {item.priority && (
                      <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--priority))] shadow-md">
                        <span className="text-[9px]">⭐</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <WishDetailDrawer
        item={items.find((i) => i.id === detailItemId) ?? null}
        open={!!detailItemId}
        onOpenChange={(open) => {
          if (!open) setDetailItemId(null);
        }}
        onToggle={togglePurchased}
        onDelete={deleteItem}
        onPriority={handlePriority}
        onEdit={editItem}
      />
    </div>
  );
}
