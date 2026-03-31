import { WishItem } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priorityItems: WishItem[];
  newItemName: string;
  onSwap: (removeId: string) => void;
}

export function PrioritySwapDialog({
  open,
  onOpenChange,
  priorityItems,
  newItemName,
  onSwap,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSwap = () => {
    if (selectedId) {
      onSwap(selectedId);
      setSelectedId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSelectedId(null); }}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            Priority list full ⭐
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You can only have 5 priorities. To add <strong className="text-foreground font-bold">{newItemName}</strong>, remove one:
        </p>
        <div className="space-y-2 py-2">
          {priorityItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
                selectedId === item.id
                  ? "border-primary bg-primary/8 ring-2 ring-primary/20 shadow-sm"
                  : "border-border/50 bg-muted/30 hover:border-primary/30"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--priority)/0.12)] shrink-0">
                <Star className="h-4 w-4 text-[hsl(var(--priority))] fill-[hsl(var(--priority))]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-card-foreground truncate">{item.name}</p>
                {item.estimatedCost != null && (
                  <p className="text-xs text-muted-foreground font-semibold">${item.estimatedCost.toFixed(2)}</p>
                )}
              </div>
              {selectedId === item.id && (
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Remove</span>
              )}
            </motion.button>
          ))}
        </div>
        <Button
          onClick={handleSwap}
          disabled={!selectedId}
          className="w-full rounded-xl h-12 text-sm font-bold shadow-lg shadow-primary/25"
        >
          Swap priority ⭐
        </Button>
      </DialogContent>
    </Dialog>
  );
}
