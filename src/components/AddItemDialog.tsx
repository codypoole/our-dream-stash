import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { WishItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

interface Props {
  onAdd: (item: Omit<WishItem, "id" | "purchased" | "createdAt">) => void;
}

export function AddItemDialog({ onAdd }: Props) {
  const { visibleCategories } = useCategories();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  const reset = () => {
    setName("");
    setCategory("");
    setCost("");
    setUrl("");
    setNote("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;
    onAdd({
      name: name.trim(),
      category,
      estimatedCost: cost ? parseFloat(cost) : null,
      url: url.trim(),
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Wish
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Make a wish ✨</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">What do you want?</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "AirPods Max"'
              className="rounded-xl h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 border",
                    category === cat.name
                      ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-sm font-medium">Estimated cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="rounded-xl h-11 pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">Link</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-11 text-sm font-semibold shadow-md shadow-primary/20"
            disabled={!name.trim() || !category}
          >
            Add to wish list 🎉
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
