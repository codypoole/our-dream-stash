import { useState, useEffect } from "react";
import { Category, DEFAULT_CATEGORIES } from "@/lib/types";

const STORAGE_KEY = "wish-list-categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

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
