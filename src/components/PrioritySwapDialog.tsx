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
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Priority list full ⭐
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You can only have 5 priorities. To add <strong className="text-foreground">{newItemName}</strong>, remove one:
        </p>
        <div className="space-y-2 py-2">
          {priorityItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                selectedId === item.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground truncate">{item.name}</p>
                {item.estimatedCost != null && (
                  <p className="text-xs text-muted-foreground">${item.estimatedCost.toFixed(2)}</p>
                )}
              </div>
              {selectedId === item.id && (
                <span className="text-xs font-medium text-primary">Remove</span>
              )}
            </motion.button>
          ))}
        </div>
        <Button
          onClick={handleSwap}
          disabled={!selectedId}
          className="w-full rounded-xl h-11 text-sm font-semibold shadow-md shadow-primary/20"
        >
          Swap priority ⭐
        </Button>
      </DialogContent>
    </Dialog>
  );
}
