export interface WishItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number | null;
  url: string;
  person: "Me" | "Wife";
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
