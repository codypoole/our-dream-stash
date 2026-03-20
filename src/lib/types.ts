export interface WishItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number | null;
  url: string;
  note: string;
  image: string;
  purchased: boolean;
  priority: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  hidden: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "electronics", name: "Electronics", emoji: "⚡", hidden: false },
  { id: "home", name: "Home", emoji: "🏠", hidden: false },
  { id: "clothing", name: "Clothing", emoji: "👗", hidden: false },
  { id: "books", name: "Books", emoji: "📚", hidden: false },
  { id: "kitchen", name: "Kitchen", emoji: "🍳", hidden: false },
  { id: "travel", name: "Travel", emoji: "✈️", hidden: false },
  { id: "other", name: "Other", emoji: "✨", hidden: false },
];

export type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name";
