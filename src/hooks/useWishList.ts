import { useState, useEffect } from "react";
import { WishItem } from "@/lib/types";

const STORAGE_KEY = "wish-list-items";

export function useWishList() {
  const [items, setItems] = useState<WishItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<WishItem, "id" | "purchased" | "createdAt">) => {
    setItems((prev) => [
      {
        ...item,
        note: item.note ?? "",
        priority: item.priority ?? false,
        id: crypto.randomUUID(),
        purchased: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const priorityCount = items.filter((i) => i.priority && !i.purchased).length;

  const togglePriority = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, priority: !item.priority } : item
      )
    );
  };

  const getPriorityItems = () => items.filter((i) => i.priority && !i.purchased);

  const togglePurchased = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, addItem, togglePurchased, deleteItem, togglePriority, priorityCount, getPriorityItems };
}
