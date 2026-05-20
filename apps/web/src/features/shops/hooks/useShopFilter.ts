"use client";

import { useState, useMemo, useEffect } from "react";
import { shops as staticShops, Shop } from "@/features/shops/data/shops";
import { useLocationStore } from "@/features/location/store/useLocationStore";
import { fetchNearbyShopsFromOverpass } from "@/features/shops/services/overpass";

type SortBy = "distance" | "rating" | "reviews";

export function useShopFilter(initialArea = "") {
  const [search, setSearch] = useState("");
  const { selectedCity, selectedArea, setSelectedArea, detectedLocation } = useLocationStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  void initialArea;
  const [openOnly, setOpenOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(6);
  const [sortBy, setSortBy] = useState<SortBy>("distance");

  const [dynamicShops, setDynamicShops] = useState<Shop[]>([]);
  const [isFetchingShops, setIsFetchingShops] = useState(false);

  useEffect(() => {
    if (detectedLocation) {
      let isMounted = true;
      // Reflect the external location fetch lifecycle in local UI state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFetchingShops(true);
      
      fetchNearbyShopsFromOverpass(detectedLocation.lat, detectedLocation.lng, 4000, selectedCity, selectedArea)
        .then(fetchedShops => {
          if (isMounted) {
            setDynamicShops(fetchedShops);
            setIsFetchingShops(false);
          }
        })
        .catch(err => {
          console.error("Failed to fetch dynamic shops", err);
          if (isMounted) setIsFetchingShops(false);
        });
        
      return () => { isMounted = false; };
    }
  }, [detectedLocation, selectedCity, selectedArea]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedArea !== "") count++;
    if (selectedCategory !== "All") count++;
    if (openOnly) count++;
    if (maxDistance < 6) count++;
    if (sortBy !== "distance") count++; 
    return count;
  }, [selectedArea, selectedCategory, openOnly, maxDistance, sortBy]);

  const clearFilters = () => {
    setSelectedArea("");
    setSelectedCategory("All");
    setOpenOnly(false);
    setMaxDistance(6);
    setSortBy("distance");
  };

  const filteredShops = useMemo(() => {
    // Use dynamic shops if we have them, otherwise fallback to static shops
    const baseShops = dynamicShops.length > 0 ? dynamicShops : staticShops;
    
    let result = [...baseShops];

    // City filter (only needed for static shops typically, but safe to apply)
    if (selectedCity && selectedCity !== "" && dynamicShops.length === 0) {
      result = result.filter((shop) => shop.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Search filter
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.category.toLowerCase().includes(query) ||
          (shop.products && shop.products.some((p) => p.toLowerCase().includes(query)))
      );
    }

    // Area filter
    if (selectedArea !== "" && dynamicShops.length === 0) {
      // Dynamic shops are naturally within the area/radius, 
      // but if we are on static shops, strictly filter by area string
      result = result.filter((shop) => shop.area === selectedArea);
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((shop) => shop.category === selectedCategory);
    }

    // Open Only filter
    if (openOnly) {
      result = result.filter((shop) => shop.open);
    }

    // Distance filter
    if (maxDistance < 6) {
      result = result.filter((shop) => shop.distance <= maxDistance);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "distance") {
        return a.distance - b.distance;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "reviews") {
        return b.reviews - a.reviews;
      }
      return 0;
    });

    return result;
  }, [selectedCity, search, selectedArea, selectedCategory, openOnly, maxDistance, sortBy, dynamicShops]);

  return {
    filteredShops,
    isFetchingShops,
    search,
    setSearch,
    selectedArea,
    setSelectedArea,
    selectedCategory,
    setSelectedCategory,
    openOnly,
    setOpenOnly,
    maxDistance,
    setMaxDistance,
    sortBy,
    setSortBy,
    clearFilters,
    activeFilterCount,
  };
}
