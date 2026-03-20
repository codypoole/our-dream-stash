import { useState } from "react";
import { motion } from "framer-motion";
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
import { Plus, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { WishItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { ImagePicker } from "@/components/ImagePicker";

interface Props {
  onAdd: (item: Omit<WishItem, "id" | "purchased" | "createdAt">) => void;
  priorityCount: number;
}

export function AddItemDialog({ onAdd, priorityCount }: Props) {
  const { visibleCategories } = useCategories();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState(false);

  const reset = () => {
    setName("");
    setCategory("");
    setCost("");
    setUrl("");
    setNote("");
    setPriority(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;
    onAdd({
      name: name.trim(),
      category,
      estimatedCost: cost ? parseFloat(cost) : null,
      url: url.trim(),
      note: note.trim(),
      priority,
    });
    reset();
    setOpen(false);
  };

  const canSetPriority = priorityCount < 5;

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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="amazon.com/..."
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any details or thoughts..."
              className="rounded-xl min-h-[60px] resize-none"
              rows={2}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (canSetPriority || priority) setPriority(!priority);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border p-3 transition-all",
              priority
                ? "border-amber-400 bg-amber-50 dark:bg-amber-500/10"
                : canSetPriority
                  ? "border-border bg-card hover:border-amber-400/50"
                  : "border-border bg-muted opacity-50 cursor-not-allowed"
            )}
          >
            <Star className={cn(
              "h-5 w-5 transition-colors",
              priority ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
            )} />
            <div className="flex-1 text-left">
              <p className={cn("text-sm font-medium", priority ? "text-amber-700 dark:text-amber-400" : "text-card-foreground")}>
                Mark as priority
              </p>
              <p className="text-xs text-muted-foreground">
                {canSetPriority
                  ? `${5 - priorityCount} priority slot${5 - priorityCount !== 1 ? "s" : ""} remaining`
                  : "All 5 priority slots used"}
              </p>
            </div>
          </button>

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
