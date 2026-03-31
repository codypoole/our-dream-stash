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
  const [image, setImage] = useState("");
  const [priority, setPriority] = useState(false);

  const reset = () => {
    setName("");
    setCategory("");
    setCost("");
    setUrl("");
    setNote("");
    setImage("");
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
      image,
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
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Wish
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/60">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">Make a wish ✨</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">What do you want?</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "AirPods Max"'
              className="rounded-xl h-11 bg-background/50 border-border/60 focus:border-primary/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Category</Label>
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 border",
                    category === cat.name
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.03]"
                      : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-sm font-semibold">Estimated cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="rounded-xl h-11 pl-7 bg-background/50 border-border/60"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-semibold">Link</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="amazon.com/..."
                className="rounded-xl h-11 bg-background/50 border-border/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-semibold">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any details or thoughts..."
              className="rounded-xl min-h-[60px] resize-none bg-background/50 border-border/60"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Photo (optional)</Label>
            <ImagePicker value={image} onChange={setImage} />
          </div>

          <button
            type="button"
            onClick={() => {
              if (canSetPriority || priority) setPriority(!priority);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border p-3.5 transition-all duration-200",
              priority
                ? "border-amber-300 bg-amber-50/80 shadow-sm shadow-amber-500/10"
                : canSetPriority
                  ? "border-border/60 bg-card hover:border-amber-300/60 hover:bg-amber-50/30"
                  : "border-border/60 bg-muted opacity-50 cursor-not-allowed"
            )}
          >
            <Star className={cn(
              "h-5 w-5 transition-all duration-200",
              priority ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
            )} />
            <div className="flex-1 text-left">
              <p className={cn("text-sm font-semibold", priority ? "text-amber-700" : "text-card-foreground")}>
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
            className="w-full rounded-xl h-12 text-sm font-bold shadow-lg shadow-primary/20"
            disabled={!name.trim() || !category}
          >
            Add to wish list 🎉
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
