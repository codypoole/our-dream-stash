import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWishList } from "@/hooks/useWishList";
import { AddItemDialog } from "@/components/AddItemDialog";
import { WishCard } from "@/components/WishCard";
import { CategoryFilter } from "@/components/CategoryBadge";
import { PrioritySwapDialog } from "@/components/PrioritySwapDialog";
import { SortOption } from "@/lib/types";
import { ArrowDownUp, Eye, EyeOff, Sparkles } from "lucide-react";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-high", label: "$$$ → $" },
  { value: "price-low", label: "$ → $$$" },
  { value: "name", label: "A → Z" },
];

const Index = () => {
  const { items, addItem, togglePurchased, deleteItem, togglePriority, priorityCount, getPriorityItems } = useWishList();
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showPurchased, setShowPurchased] = useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [pendingPriorityId, setPendingPriorityId] = useState<string | null>(null);

  const handlePriority = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    // If already priority, just remove it
    if (item.priority) {
      togglePriority(id);
      return;
    }

    // If under limit, just add
    if (priorityCount < 5) {
      togglePriority(id);
      return;
    }

    // At limit — open swap dialog
    setPendingPriorityId(id);
    setSwapDialogOpen(true);
  };

  const handleSwap = (removeId: string) => {
    togglePriority(removeId); // remove old
    if (pendingPriorityId) {
      togglePriority(pendingPriorityId); // add new
    }
    setSwapDialogOpen(false);
    setPendingPriorityId(null);
  };

  const pendingItem = items.find((i) => i.id === pendingPriorityId);

  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      if (filterCategory !== "All" && item.category !== filterCategory) return false;
      if (!showPurchased && item.purchased) return false;
      return true;
    });

    // Priority items first, then sort within each group
    const sortFn = (a: typeof result[0], b: typeof result[0]) => {
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
    };

    const priorities = result.filter((i) => i.priority && !i.purchased).sort(sortFn);
    const rest = result.filter((i) => !(i.priority && !i.purchased)).sort(sortFn);

    return [...priorities, ...rest];
  }, [items, filterCategory, sortBy, showPurchased]);

  const totalEstimated = filtered.reduce(
    (sum, item) => sum + (item.estimatedCost ?? 0),
    0
  );

  const purchasedCount = items.filter((i) => i.purchased).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">Wish List</h1>
          </div>
          <AddItemDialog onAdd={addItem} />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-5 space-y-4">
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-2xl bg-card border p-3"
          >
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-foreground">{items.length - purchasedCount}</p>
              <p className="text-xs text-muted-foreground">Wishes</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-purchased">{purchasedCount}</p>
              <p className="text-xs text-muted-foreground">Purchased</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-foreground">
                ${totalEstimated > 999 ? `${(totalEstimated / 1000).toFixed(1)}k` : totalEstimated.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </div>
          </motion.div>
        )}

        <CategoryFilter selected={filterCategory} onChange={setFilterCategory} />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex gap-1 overflow-x-auto">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    sortBy === opt.value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowPurchased(!showPurchased)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            title={showPurchased ? "Hide purchased" : "Show purchased"}
          >
            {showPurchased ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPurchased ? "Hide" : "Show"} bought
          </button>
        </div>

        <div className="space-y-2.5 pb-20">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <span className="text-5xl mb-4">🌟</span>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {items.length === 0 ? "Start wishing!" : "Nothing here"}
                </p>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  {items.length === 0
                    ? 'Tap "Add Wish" to add your first item to the list.'
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
    </div>
  );
};

export default Index;
