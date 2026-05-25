import { useState, useEffect } from "react";
import { WishItem } from "@/lib/types";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const COLLECTION = "wishes";

export function useWishList() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishes: WishItem[] = [];
      snapshot.forEach((d) => {
        wishes.push({ id: d.id, ...d.data() } as WishItem);
      });
      setItems(wishes);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addItem = async (
    item: Omit<WishItem, "id" | "purchased" | "createdAt">
  ) => {
    const id = crypto.randomUUID();
    const newItem: WishItem = {
      ...item,
      note: item.note ?? "",
      image: item.image ?? "",
      priority: item.priority ?? false,
      id,
      purchased: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION, id), newItem);
  };

  const togglePurchased = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateDoc(doc(db, COLLECTION, id), {
      purchased: !item.purchased,
    });
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  const editItem = async (
    id: string,
    updates: Partial<Omit<WishItem, "id" | "createdAt">>
  ) => {
    await updateDoc(doc(db, COLLECTION, id), updates);
  };

  const togglePriority = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateDoc(doc(db, COLLECTION, id), {
      priority: !item.priority,
    });
  };

  const priorityCount = items.filter((i) => i.priority && !i.purchased).length;
  const getPriorityItems = () =>
    items.filter((i) => i.priority && !i.purchased);

  return {
    items,
    loading,
    addItem,
    togglePurchased,
    deleteItem,
    editItem,
    togglePriority,
    priorityCount,
    getPriorityItems,
  };
}
