import { WishItem } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Star, Trash2, Calendar, DollarSign, Link2, StickyNote } from "lucide-react";

interface Props {
  item: WishItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriority: (id: string) => void;
}

export function WishDetailDrawer({ item, open, onOpenChange, onToggle, onDelete, onPriority }: Props) {
  if (!item) return null;

  const createdDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <div className="mx-auto w-full max-w-md px-6 pb-8">
          <DrawerHeader className="px-0 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <CategoryBadge category={item.category} />
              {item.priority && !item.purchased && (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              )}
              {item.purchased && (
                <span className="rounded-full bg-purchased px-2.5 py-0.5 text-xs font-semibold text-purchased-foreground">
                  Purchased 🎊
                </span>
              )}
            </div>
            <DrawerTitle className={cn(
              "font-display text-2xl text-left",
              item.purchased && "line-through opacity-60"
            )}>
              {item.name}
            </DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 pt-2">
            {/* Cost */}
            {item.estimatedCost != null && (
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated cost</p>
                  <p className="text-lg font-bold text-foreground">${item.estimatedCost.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Note */}
            {item.note && (
              <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
                <StickyNote className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Note</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{item.note}</p>
                </div>
              </div>
            )}

            {/* Link */}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
              >
                <Link2 className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Link</p>
                  <p className="text-sm text-primary truncate">{item.url}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </a>
            )}

            {/* Date */}
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Added on</p>
                <p className="text-sm text-foreground">{createdDate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => { onToggle(item.id); onOpenChange(false); }}
                variant={item.purchased ? "outline" : "default"}
                className="flex-1 rounded-xl h-11 text-sm font-semibold"
              >
                <Check className="h-4 w-4 mr-1.5" />
                {item.purchased ? "Unmark purchased" : "Mark as purchased"}
              </Button>
              {!item.purchased && (
                <Button
                  onClick={() => { onPriority(item.id); }}
                  variant="outline"
                  className={cn(
                    "rounded-xl h-11 px-3",
                    item.priority && "border-amber-400 text-amber-600"
                  )}
                >
                  <Star className={cn("h-4 w-4", item.priority && "fill-amber-500 text-amber-500")} />
                </Button>
              )}
              <Button
                onClick={() => { onDelete(item.id); onOpenChange(false); }}
                variant="outline"
                className="rounded-xl h-11 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
