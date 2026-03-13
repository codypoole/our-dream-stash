import { useState } from "react";
import { useWishList } from "@/hooks/useWishList";
import { AddItemDialog } from "@/components/AddItemDialog";
import { WishCard } from "@/components/WishCard";
import { DEFAULT_CATEGORIES } from "@/lib/types";
import { Heart } from "lucide-react";

const PEOPLE = ["All", "Me", "Wife"] as const;

const Index = () => {
  const { items, addItem, togglePurchased, deleteItem } = useWishList();
  const [filterPerson, setFilterPerson] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [showPurchased, setShowPurchased] = useState(false);

  const filtered = items.filter((item) => {
    if (filterPerson !== "All" && item.person !== filterPerson) return false;
    if (filterCategory !== "All" && item.category !== filterCategory) return false;
    if (!showPurchased && item.purchased) return false;
    return true;
  });

  const totalEstimated = filtered.reduce(
    (sum, item) => sum + (item.estimatedCost ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
            <h1 className="text-lg font-bold text-foreground">Our Wish List</h1>
          </div>
          <AddItemDialog onAdd={addItem} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {PEOPLE.map((p) => (
            <button
              key={p}
              onClick={() => setFilterPerson(p)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filterPerson === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-full border bg-card px-3 py-1 text-sm text-card-foreground"
          >
            <option value="All">All categories</option>
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={showPurchased}
              onChange={(e) => setShowPurchased(e.target.checked)}
              className="rounded accent-primary"
            />
            Show purchased
          </label>
        </div>

        {/* Summary */}
        {filtered.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {filtered.length} item{filtered.length !== 1 && "s"}
            {totalEstimated > 0 && ` · ~$${totalEstimated.toFixed(2)} estimated`}
          </p>
        )}

        {/* Items */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                {items.length === 0
                  ? "No wishes yet — tap Add Wish to get started!"
                  : "No items match your filters."}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <WishCard
                key={item.id}
                item={item}
                onToggle={togglePurchased}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
