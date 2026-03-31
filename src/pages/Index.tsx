import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWishList } from "@/hooks/useWishList";
import { AddItemDialog } from "@/components/AddItemDialog";
import { WishCard } from "@/components/WishCard";
import { CategoryFilter } from "@/components/CategoryBadge";
import { PrioritySwapDialog } from "@/components/PrioritySwapDialog";
import { WishDetailDrawer } from "@/components/WishDetailDrawer";
import { SortOption } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Eye, EyeOff, Filter, Search, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-high", label: "$$$ → $" },
  { value: "price-low", label: "$ → $$$" },
  { value: "name", label: "A → Z" },
];

const Index = () => {
  const { items, addItem, togglePurchased, deleteItem, editItem, togglePriority, priorityCount, getPriorityItems } = useWishList();
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showPurchased, setShowPurchased] = useState(false);
  const [showOnlyPriority, setShowOnlyPriority] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [pendingPriorityId, setPendingPriorityId] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [detailItemId, setDetailItemId] = useState<string | null>(null);

  const handleAddItem = (item: Parameters<typeof addItem>[0] & { priority?: boolean }) => {
    addItem(item);
  };

  const handlePriority = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (item.priority) {
      togglePriority(id);
      return;
    }

    if (priorityCount < 5) {
      togglePriority(id);
      return;
    }

    setPendingPriorityId(id);
    setSwapDialogOpen(true);
  };

  const handleSwap = (removeId: string) => {
    togglePriority(removeId);
    if (pendingPriorityId) {
      togglePriority(pendingPriorityId);
    }
    setSwapDialogOpen(false);
    setPendingPriorityId(null);
  };

  const pendingItem = items.find((i) => i.id === pendingPriorityId);

  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      if (filterCategory !== "All" && item.category !== filterCategory) return false;
      if (!showPurchased && item.purchased) return false;
      if (showOnlyPriority && !item.priority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.category.toLowerCase().includes(q) &&
          !(item.note && item.note.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return (b.estimatedCost ?? 0) - (a.estimatedCost ?? 0);
        case "price-low":
          return (a.estimatedCost ?? 0) - (b.estimatedCost ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Within the sorted list, float priorities to top (stable)
    const priorities = result.filter((i) => i.priority && !i.purchased);
    const rest = result.filter((i) => !(i.priority && !i.purchased));
    return [...priorities, ...rest];
  }, [items, filterCategory, sortBy, showPurchased, showOnlyPriority, searchQuery]);

  const totalEstimated = filtered.reduce(
    (sum, item) => sum + (item.estimatedCost ?? 0),
    0
  );

  const purchasedCount = items.filter((i) => i.purchased).length;

  return (
    <div className="min-h-screen bg-background relative">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/85 backdrop-blur-2xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
              <Sparkles className="h-[18px] w-[18px] text-primary" />
            </div>
            <div>
              <p className="font-display text-[9px] font-semibold italic tracking-[0.22em] text-muted-foreground uppercase leading-none mb-0.5">our</p>
              <h1 className="font-display text-[1.1rem] font-bold text-foreground leading-none tracking-tight">Dream Stash</h1>
            </div>
          </div>
          <AddItemDialog onAdd={handleAddItem} priorityCount={priorityCount} />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-5 space-y-4 relative z-[1]">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your stash..."
            className="rounded-2xl h-11 pl-10 bg-card/70 border-border/50 shadow-sm shadow-black/20 transition-shadow focus:shadow-md focus:shadow-primary/[0.1] placeholder:text-muted-foreground/60"
          />
        </div>

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-stretch rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-md shadow-black/20"
          >
            <div className="flex-1 flex flex-col items-center justify-center py-4 px-3">
              <p className="font-display text-[2rem] font-bold text-foreground leading-none">{items.length - purchasedCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">Wishes</p>
            </div>
            <div className="w-px bg-border/50 my-3" />
            <div className="flex-1 flex flex-col items-center justify-center py-4 px-3">
              <p className="font-display text-[2rem] font-bold text-[hsl(var(--purchased))] leading-none">{purchasedCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">Purchased</p>
            </div>
            <div className="w-px bg-border/50 my-3" />
            <div className="flex-1 flex flex-col items-center justify-center py-4 px-3">
              <p className="font-display text-[2rem] font-bold text-foreground leading-none">
                ${totalEstimated > 999 ? `${(totalEstimated / 1000).toFixed(1)}k` : totalEstimated.toFixed(0)}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">Estimated</p>
            </div>
          </motion.div>
        )}

        {/* Toggle for filters/sort */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowControls(!showControls)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200",
              showControls
                ? "bg-foreground text-background shadow-md shadow-black/20"
                : "bg-card/70 text-muted-foreground border border-border/50 hover:border-border hover:text-foreground"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters & Sort
          </button>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowOnlyPriority(!showOnlyPriority)}
              className={cn(
                "flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-200",
                showOnlyPriority
                  ? "bg-[hsl(var(--priority)/0.12)] text-[hsl(var(--priority))] border border-[hsl(var(--priority)/0.35)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/70"
              )}
              title={showOnlyPriority ? "Show all" : "Show priorities only"}
            >
              <Star className={cn("h-3.5 w-3.5", showOnlyPriority && "fill-[hsl(var(--priority))]")} />
            </button>
            <button
              onClick={() => setShowPurchased(!showPurchased)}
              className={cn(
                "flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-200",
                showPurchased
                  ? "bg-card/70 text-foreground border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/70"
              )}
              title={showPurchased ? "Hide purchased" : "Show purchased"}
            >
              {showPurchased ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPurchased ? "Hide" : "Show"} bought
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-3"
            >
              {/* Filters row */}
              <CategoryFilter selected={filterCategory} onChange={setFilterCategory} />

              {/* Sort row */}
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={cn(
                        "shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200",
                        sortBy === opt.value
                          ? "bg-foreground text-background shadow-md shadow-black/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent hover:border-border/50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2.5 pb-32">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                  <span className="text-3xl">🌟</span>
                </div>
                <p className="font-display text-lg font-bold text-foreground mb-1.5">
                  {items.length === 0 ? "Start wishing!" : "Nothing here"}
                </p>
                <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                  {items.length === 0
                    ? 'Tap "Add Wish" to add your first item to the stash.'
                    : "Try changing your filters to see more items."}
                </p>
              </motion.div>
            ) : (
              filtered.map((item) => (
                <WishCard
                  key={item.id}
                  item={item}
                  onToggle={togglePurchased}
                  onDelete={deleteItem}
                  onPriority={handlePriority}
                  onOpen={(id) => setDetailItemId(id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <PrioritySwapDialog
        open={swapDialogOpen}
        onOpenChange={setSwapDialogOpen}
        priorityItems={getPriorityItems()}
        newItemName={pendingItem?.name ?? ""}
        onSwap={handleSwap}
      />

      <WishDetailDrawer
        item={items.find((i) => i.id === detailItemId) ?? null}
        open={!!detailItemId}
        onOpenChange={(open) => { if (!open) setDetailItemId(null); }}
        onToggle={togglePurchased}
        onDelete={deleteItem}
        onPriority={handlePriority}
        onEdit={editItem}
      />
    </div>
  );
};

export default Index;
