import { WishItem } from "@/lib/types";
import { Check, ExternalLink, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  item: WishItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function WishCard({ item, onToggle, onDelete }: Props) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-4 transition-all duration-200",
        item.purchased && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {item.person}
            </span>
            <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {item.category}
            </span>
          </div>
          <h3
            className={cn(
              "font-semibold text-card-foreground",
              item.purchased && "line-through"
            )}
          >
            {item.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            {item.estimatedCost != null && (
              <span>${item.estimatedCost.toFixed(2)}</span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Link <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggle(item.id)}
            title={item.purchased ? "Mark as not purchased" : "Mark as purchased"}
          >
            {item.purchased ? (
              <Undo2 className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(item.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {item.purchased && (
        <div className="absolute top-3 right-14 rounded-full bg-purchased px-2 py-0.5 text-xs font-medium text-purchased-foreground">
          Purchased ✓
        </div>
      )}
    </div>
  );
}
