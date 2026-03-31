import { useState } from "react";
import { WishItem } from "@/lib/types";
import { Check, ExternalLink, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CategoryBadge } from "./CategoryBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  item: WishItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriority: (id: string) => void;
  onOpen: (id: string) => void;
}

const MotionCard = motion.div;

export function WishCard({ item, onToggle, onDelete, onPriority, onOpen }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <MotionCard
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all duration-300",
          "shadow-sm shadow-black/[0.03] hover:shadow-md hover:shadow-black/[0.06]",
          "border-border/60 hover:border-border",
          item.purchased && "opacity-45",
          item.priority && !item.purchased && "border-amber-300/60 shadow-amber-500/[0.08] bg-gradient-to-r from-amber-50/40 to-card"
        )}
      >
        {item.purchased && (
          <div className="absolute top-0 right-0 rounded-bl-2xl bg-purchased px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-purchased-foreground">
            Got it! 🎊
          </div>
        )}

        <div className="flex items-start gap-3">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => onToggle(item.id)}
            className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
              item.purchased
                ? "border-purchased bg-purchased text-purchased-foreground"
                : "border-border/80 hover:border-primary hover:bg-primary/5 hover:scale-110"
            )}
          >
            {item.purchased && <Check className="h-3.5 w-3.5" />}
          </motion.button>

          <button
            type="button"
            onClick={() => onOpen(item.id)}
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <CategoryBadge category={item.category} />
              {item.estimatedCost != null && (
                <span className="font-display text-sm font-bold text-foreground">
                  ${item.estimatedCost.toFixed(2)}
                </span>
              )}
            </div>
            <h3
              className={cn(
                "font-semibold text-card-foreground leading-tight tracking-[-0.01em]",
                item.purchased && "line-through"
              )}
            >
              {item.name}
            </h3>
            {item.note && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1 leading-relaxed">{item.note}</p>
            )}
          </button>

          {item.image && (
            <button
              type="button"
              onClick={() => onOpen(item.id)}
              className="shrink-0 rounded-xl overflow-hidden border border-border/60 bg-muted shadow-sm shadow-black/[0.04] transition-transform duration-200 hover:scale-105"
            >
              <img src={item.image} alt={item.name} className="h-14 w-14 object-cover" />
            </button>
          )}

          <div className="flex flex-col items-center gap-1">
            {!item.purchased && (
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => onPriority(item.id)}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  item.priority
                    ? "text-amber-500 bg-amber-50"
                    : "text-muted-foreground/60 hover:text-amber-500 hover:bg-amber-50/50"
                )}
                title={item.priority ? "Remove priority" : "Set as priority"}
              >
                <Star className={cn("h-3.5 w-3.5", item.priority && "fill-amber-500")} />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setConfirmDelete(true)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-200 hover:bg-destructive/8 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </MotionCard>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-2xl border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-lg">Delete "{item.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This wish will be permanently removed from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(item.id)}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
