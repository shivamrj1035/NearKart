"use client";

import { useState, useEffect, useCallback } from "react";

function getSaved() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("shopnear_saved_shops");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useSavedShops() {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    // Hydrate from localStorage after mount and listen for cross-tab updates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedIds(getSaved());

    const handleStorageChange = () => {
      setSavedIds(getSaved());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("shopnear_saved_update", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("shopnear_saved_update", handleStorageChange);
    };
  }, []);

  const isSaved = useCallback((id: number) => {
    return savedIds.includes(id);
  }, [savedIds]);

  const toggleSave = useCallback((id: number) => {
    const current = getSaved();
    let next: number[];
    if (current.includes(id)) {
      next = current.filter((item: number) => item !== id);
    } else {
      next = [...current, id];
    }
    try {
      localStorage.setItem("shopnear_saved_shops", JSON.stringify(next));
      window.dispatchEvent(new Event("shopnear_saved_update"));
    } catch (error) {
      console.error(error);
    }
    setSavedIds(next);
  }, []);

  return { savedIds, isSaved, toggleSave };
}
