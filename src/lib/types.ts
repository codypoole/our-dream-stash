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

];

export type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name";
