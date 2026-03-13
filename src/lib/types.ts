export interface WishItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number | null;
  url: string;
  purchased: boolean;
  createdAt: string;
}

export const DEFAULT_CATEGORIES = [
  "Electronics",
  "Home",
  "Clothing",
  "Books",
  "Kitchen",
  "Travel",
  "Other",
] as const;

export type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name";
