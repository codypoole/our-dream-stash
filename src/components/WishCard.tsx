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
}

const MotionCard = motion.div;

export function WishCard({ item, onToggle, onDelete, onPriority }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <MotionCard
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-card p-4 transition-shadow duration-200 hover:shadow-md",
          item.purchased && "opacity-50",
          item.priority && !item.purchased && "border-amber-400/50 shadow-sm shadow-amber-500/10"
        )}
      >
        {item.purchased && (
          <div className="absolute top-0 right-0 rounded-bl-xl bg-purchased px-3 py-1 text-xs font-semibold text-purchased-foreground">
            Got it! 🎊
          </div>
        )}

        <div className="flex items-start gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onToggle(item.id)}
            className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              item.purchased
                ? "border-purchased bg-purchased text-purchased-foreground"
                : "border-border hover:border-primary hover:bg-primary/5"
            )}
          >
            {item.purchased && <Check className="h-3.5 w-3.5" />}
          </motion.button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <CategoryBadge category={item.category} />
              {item.estimatedCost != null && (
                <span className="text-sm font-semibold text-foreground">
                  ${item.estimatedCost.toFixed(2)}
                </span>
              )}
            </div>
            <h3
              className={cn(
                "font-semibold text-card-foreground leading-tight",
                item.purchased && "line-through"
              )}
            >
              {item.name}
            </h3>
            {item.note && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.note}</p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View link <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="flex flex-col items-center gap-1">
            {!item.purchased && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onPriority(item.id)}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                  item.priority
                    ? "text-amber-500"
                    : "text-muted-foreground hover:text-amber-500"
                )}
                title={item.priority ? "Remove priority" : "Set as priority"}
              >
                <Star className={cn("h-3.5 w-3.5", item.priority && "fill-amber-500")} />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setConfirmDelete(true)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </MotionCard>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{item.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This wish will be permanently removed from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(item.id)}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
