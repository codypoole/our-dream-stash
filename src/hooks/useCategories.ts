import { useState, useEffect } from "react";
import { Category } from "@/lib/types";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const COLLECTION = "categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTION), (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((d) => {
        cats.push({ id: d.id, ...d.data() } as Category);
      });
      cats.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(cats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const visibleCategories = categories.filter((c) => !c.hidden);

  const addCategory = async (name: string, emoji: string) => {
    const id = crypto.randomUUID();
    await setDoc(doc(db, COLLECTION, id), {
      id,
      name: name.trim(),
      emoji,
      hidden: false,
    });
  };

  const editCategory = async (id: string, name: string, emoji: string) => {
    await updateDoc(doc(db, COLLECTION, id), {
      name: name.trim(),
      emoji,
    });
  };

  const toggleHidden = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    await updateDoc(doc(db, COLLECTION, id), {
      hidden: !cat.hidden,
    });
  };

  return {
    categories,
    loading,
    visibleCategories,
    addCategory,
    editCategory,
    toggleHidden,
  };
}
