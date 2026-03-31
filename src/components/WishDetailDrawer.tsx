import { useState, useEffect } from "react";
import { WishItem } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";
import { normalizeUrl } from "@/lib/urlUtils";
import { useCategories } from "@/hooks/useCategories";
import { ImagePicker } from "@/components/ImagePicker";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check, ExternalLink, Star, Trash2, Calendar,
  DollarSign, Link2, StickyNote, Pencil, X,
} from "lucide-react";

interface Props {
  item: WishItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriority: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<WishItem, "id" | "createdAt">>) => void;
}

export function WishDetailDrawer({ item, open, onOpenChange, onToggle, onDelete, onPriority, onEdit }: Props) {
  const { visibleCategories } = useCategories();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState("");

  // Sync form state when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setCost(item.estimatedCost != null ? String(item.estimatedCost) : "");
      setUrl(item.url);
      setNote(item.note || "");
      setImage(item.image || "");
      setEditing(false);
    }
  }, [item?.id, open]);

  if (!item) return null;

  const createdDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSave = () => {
    if (!name.trim() || !category) return;
    onEdit(item.id, {
      name: name.trim(),
      category,
      estimatedCost: cost ? parseFloat(cost) : null,
      url: url.trim(),
      note: note.trim(),
      image,
    });
    setEditing(false);
  };

  const displayUrl = item.url ? normalizeUrl(item.url) : "";

  return (
    <Drawer open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setEditing(false); }}>
      <DrawerContent className="rounded-t-3xl border-t border-border/40">
        <div className="mx-auto w-full max-w-md px-6 pb-8">
          <DrawerHeader className="px-0 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!editing && <CategoryBadge category={item.category} />}
                {item.priority && !item.purchased && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  </div>
                )}
                {item.purchased && (
                  <span className="rounded-xl bg-purchased px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purchased-foreground">
                    Purchased 🎊
                  </span>
                )}
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(item.name);
                    setCategory(item.category);
                    setCost(item.estimatedCost != null ? String(item.estimatedCost) : "");
                    setUrl(item.url);
                    setNote(item.note || "");
                    setImage(item.image || "");
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {!editing && (
              <DrawerTitle className={cn(
                "font-display text-2xl font-extrabold text-left tracking-tight",
                item.purchased && "line-through opacity-60"
              )}>
                {item.name}
              </DrawerTitle>
            )}
          </DrawerHeader>

          {editing ? (
            /* ---- Edit Mode ---- */
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">What do you want?</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl h-11 bg-background/50 border-border/60"
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
                          : "bg-card text-muted-foreground border-border/60 hover:border-primary/30"
                      )}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Estimated cost</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                    <Input
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
                  <Label className="text-sm font-semibold">Link</Label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="amazon.com/..."
                    className="rounded-xl h-11 bg-background/50 border-border/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Note (optional)</Label>
                <Textarea
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

              <Button
                onClick={handleSave}
                className="w-full rounded-xl h-12 text-sm font-bold shadow-lg shadow-primary/20"
                disabled={!name.trim() || !category}
              >
                Save changes ✨
              </Button>
            </div>
          ) : (
            /* ---- View Mode ---- */
            <div className="space-y-3 pt-2">
              {item.image && (
                <div className="rounded-2xl overflow-hidden border border-border/60 bg-muted shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full max-h-48 object-cover" />
                </div>
              )}
              {item.estimatedCost != null && (
                <div className="flex items-center gap-3 rounded-xl bg-muted/40 border border-border/40 p-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Estimated cost</p>
                    <p className="font-display text-xl font-extrabold text-foreground">${item.estimatedCost.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {item.note && (
                <div className="flex items-start gap-3 rounded-xl bg-muted/40 border border-border/40 p-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/60 mt-0.5">
                    <StickyNote className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Note</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{item.note}</p>
                  </div>
                </div>
              )}

              {item.url && (
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-muted/40 border border-border/40 p-3.5 transition-all duration-200 hover:bg-muted/60 hover:border-primary/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Link2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Link</p>
                    <p className="text-sm font-medium text-primary truncate">{item.url}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </a>
              )}

              <div className="flex items-center gap-3 rounded-xl bg-muted/40 border border-border/40 p-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80">
                  <Calendar className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Added on</p>
                  <p className="text-sm font-medium text-foreground">{createdDate}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  onClick={() => { onToggle(item.id); onOpenChange(false); }}
                  variant={item.purchased ? "outline" : "default"}
                  className={cn(
                    "flex-1 rounded-xl h-12 text-sm font-bold",
                    !item.purchased && "shadow-lg shadow-primary/20"
                  )}
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  {item.purchased ? "Unmark" : "Purchased"}
                </Button>
                {!item.purchased && (
                  <Button
                    onClick={() => onPriority(item.id)}
                    variant="outline"
                    className={cn(
                      "rounded-xl h-12 px-3.5 border-border/60 transition-all duration-200",
                      item.priority && "border-amber-300 bg-amber-50/50 text-amber-600"
                    )}
                  >
                    <Star className={cn("h-4 w-4", item.priority && "fill-amber-500 text-amber-500")} />
                  </Button>
                )}
                <Button
                  onClick={() => { onDelete(item.id); onOpenChange(false); }}
                  variant="outline"
                  className="rounded-xl h-12 px-3.5 text-destructive hover:bg-destructive/8 hover:text-destructive border-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
