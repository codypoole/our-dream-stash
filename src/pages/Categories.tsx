import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import { useWishList } from "@/hooks/useWishList";
import { Category } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, EyeOff, Eye, Grid3X3 } from "lucide-react";



export default function Categories() {
  const { categories, addCategory, editCategory, toggleHidden } = useCategories();
  const { items } = useWishList();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");

  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  const getStats = (catName: string) => {
    const catItems = items.filter((i) => i.category === catName);
    const purchased = catItems
      .filter((i) => i.purchased)
      .reduce((s, i) => s + (i.estimatedCost ?? 0), 0);
    const outstanding = catItems
      .filter((i) => !i.purchased)
      .reduce((s, i) => s + (i.estimatedCost ?? 0), 0);
    const count = catItems.length;
    return { purchased, outstanding, count };
  };

  const openAdd = () => {
    setEditingCat(null);
    setName("");
    setEmoji("✨");
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setEmoji(cat.emoji);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingCat) {
      editCategory(editingCat.id, name, emoji);
    } else {
      addCategory(name, emoji);
    }
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-32 relative">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/85 backdrop-blur-2xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
              <Grid3X3 className="h-[17px] w-[17px] text-primary" />
            </div>
            <div>
              <p className="font-display text-[9px] font-semibold italic tracking-[0.22em] text-muted-foreground uppercase leading-none mb-0.5">our</p>
              <h1 className="font-display text-[1.1rem] font-bold text-foreground leading-none tracking-tight">Categories</h1>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New
          </motion.button>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-5 space-y-2.5 relative z-[1]">
        <AnimatePresence mode="popLayout">
          {sorted.map((cat, index) => {
            const stats = getStats(cat.name);
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                className={`group relative rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-md hover:shadow-black/25 hover:border-border/80 ${cat.hidden ? "opacity-40" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60">
                    <span className="text-2xl">{cat.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-card-foreground tracking-[-0.01em]">{cat.name}</h3>
                      {cat.hidden && (
                        <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="font-semibold">{stats.count} wish{stats.count !== 1 ? "es" : ""}</span>
                      <span className="text-[hsl(var(--purchased))] font-bold">
                        ${stats.purchased.toFixed(0)} purchased
                      </span>
                      <span className="font-semibold text-muted-foreground">
                        ${stats.outstanding.toFixed(0)} remaining
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground/50 hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleHidden(cat.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground/50 hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      {cat.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <span className="text-3xl">🗂️</span>
            </div>
            <p className="font-display text-lg font-bold text-foreground mb-1.5">No categories yet</p>
            <p className="text-sm text-muted-foreground">Add categories to organize your wishes.</p>
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border/50 bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {editingCat ? "Edit Category" : "New Category"} ✨
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-foreground/80">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="rounded-xl h-11 bg-background/50 border-border/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-foreground/80">Emoji</Label>
              <Input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="Tap to pick an emoji"
                className="rounded-xl h-11 text-2xl text-center bg-background/50 border-border/50"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">Type or paste any emoji from your keyboard</p>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl h-12 text-sm font-bold shadow-lg shadow-primary/25"
              disabled={!name.trim()}
            >
              {editingCat ? "Save changes" : "Add category"} 🎉
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
