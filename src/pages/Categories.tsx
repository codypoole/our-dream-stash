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
import { Plus, Pencil, EyeOff, Eye, Sparkles } from "lucide-react";

const EMOJI_OPTIONS = ["⚡", "🏠", "👗", "📚", "🍳", "✈️", "✨", "🎮", "💄", "🎁", "🏋️", "🎨", "🎵", "📱", "🛋️", "🧸"];

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
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">Categories</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAdd}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New
          </motion.button>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-5 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {sorted.map((cat) => {
            const stats = getStats(cat.name);
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md ${cat.hidden ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">{cat.name}</h3>
                      {cat.hidden && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{stats.count} wish{stats.count !== 1 ? "es" : ""}</span>
                      <span className="text-purchased font-medium">
                        ${stats.purchased.toFixed(0)} purchased
                      </span>
                      <span className="font-medium">
                        ${stats.outstanding.toFixed(0)} remaining
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleHidden(cat.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {cat.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingCat ? "Edit Category" : "New Category"} ✨
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="rounded-xl h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Emoji</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all border ${
                      emoji === e
                        ? "bg-primary/10 border-primary scale-110"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl h-11 text-sm font-semibold shadow-md shadow-primary/20"
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
