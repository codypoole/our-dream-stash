import { useState } from "react";
import { Category } from "@/lib/types";
import defaultCategories from "@/data/categories.json";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories as Category[]);

  const visibleCategories = categories.filter((c) => !c.hidden);

  const addCategory = (name: string, emoji: string) => {
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), emoji, hidden: false },
    ]);
  };

  const editCategory = (id: string, name: string, emoji: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim(), emoji } : c))
    );
  };

  const toggleHidden = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c))
    );
  };

  return { categories, visibleCategories, addCategory, editCategory, toggleHidden };
}
