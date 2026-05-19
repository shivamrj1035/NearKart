"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, X, Store, Star, ChevronDown, Check } from "lucide-react";
import { useShopFilter } from "@/hooks/useShopFilter";
import { ShopCard } from "@/components/ui/ShopCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { cn } from "@/lib/utils";
import { shops } from "@/data/shops";

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Hardware",
  "Books",
  "Jewellery",
  "Grocery",
  "Furniture",
  "Pharmacy",
  "Art & Craft",
  "Sports",
  "Home & Kitchen",
  "Pet Supplies",
  "Automotive",
  "Garden",
];

const AREAS = [
  "Alkapuri",
  "Sayajigunj",
  "Fatehgunj",
  "Manjalpur",
  "Karelibaug",
  "Waghodia Rd",
  "Raopura",
  "Subhanpura",
];

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.07 },
  },
};

function HomeContent() {
  const {
    filteredShops,
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
    isFetchingShops,
  } = useShopFilter("");

  const searchParams = useSearchParams();
  const areaParam = searchParams.get("area");
  const categoryParam = searchParams.get("category");

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [areaSheetOpen, setAreaSheetOpen] = useState(false);
  const [distanceSheetOpen, setDistanceSheetOpen] = useState(false);
  const [tempDistance, setTempDistance] = useState(maxDistance);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (areaParam) {
      setSelectedArea(areaParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [areaParam, categoryParam, setSelectedArea, setSelectedCategory]);

  if (!isMounted) return null;

  return (
    <div className="flex-1 pb-20 md:pb-8">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-card-white border-b border-border-subtle shadow-sm md:shadow-none md:border-b-0 md:bg-transparent md:static md:px-6 md:pt-4">
        {/* Mobile Header Row */}
        <div className="flex justify-between items-center px-4 py-3 md:hidden">
          <div className="flex items-center gap-1.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="brandGradientHomeMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2E5BFF" />
                  <stop offset="100%" stopColor="#6398F1" />
                </linearGradient>
              </defs>
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="url(#brandGradientHomeMobile)"/>
              <path d="M10.5 7.5C10.5 8.33 11.17 9 12 9C12.83 9 13.5 8.33 13.5 7.5C13.5 6.67 12.83 6 12 6C11.17 6 10.5 6.67 10.5 7.5Z" fill="#F59E0B"/>
            </svg>
            <div className="flex">
              <span className="font-outfit font-extrabold text-[20px] text-brand-primary leading-none">Shop</span>
              <span className="font-outfit font-extrabold text-[20px] text-brand-gold leading-none">Near</span>
            </div>
          </div>

          <button
            onClick={() => setAreaSheetOpen(true)}
            className="flex items-center gap-1 bg-tag-bg text-brand-primary px-3 py-1.5 rounded-full font-figtree font-medium text-[13px]"
          >
            <MapPin size={14} />
            <span className="max-w-[100px] truncate">{selectedArea || "All Areas"}</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Search Input Control */}
        <div className="px-4 pb-3 md:px-0 md:pb-0 md:flex md:items-center md:gap-3">
          <div
            className={cn(
              "flex items-center gap-2 bg-card-white rounded-full px-3.5 py-2.5 border-[1.5px] transition-all duration-300 flex-1 md:px-4 md:py-3 shadow-xs",
              isSearchFocused ? "border-brand-primary ring-4 ring-brand-primary/10 shadow-[0_4px_20px_rgba(46,91,255,0.06)]" : "border-border-subtle hover:border-brand-primary/30"
            )}
          >
            <Search size={18} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search shops, products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent font-figtree text-[15px] outline-none placeholder:text-text-muted text-ink-dark"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch("")}
                  className="bg-border-subtle p-1 rounded-full text-text-muted"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      {activeFilterCount === 0 && search === "" && (
        <div className="px-4 pt-5 pb-3 md:px-6 md:pt-6 md:pb-4">
          <h1 className="font-outfit font-extrabold text-[24px] md:text-[32px] text-ink-dark leading-[1.2]">
            Find the right shop, before you step out.
          </h1>
          <p className="font-figtree text-[14px] md:text-[16px] text-text-muted mt-1.5">
            Discover local stores in your area — no delivery needed.
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-5">
            {[
              { text: `${shops.length} shops`, icon: Store },
              { text: "4.6★ avg", icon: Star },
              { text: `${new Set(shops.map(s => s.area)).size} areas`, icon: MapPin },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.text}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-1.5 bg-soft-cloudy-gradient text-brand-primary px-3.5 py-2 rounded-full font-figtree text-[12px] md:text-[13px] font-bold border border-brand-primary/5 shadow-xs"
                >
                  <Icon size={13} className={stat.icon === Star ? "text-brand-gold fill-brand-gold" : "text-brand-primary"} />
                  <span>{stat.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* CATEGORY STRIP */}
      <div className="overflow-x-auto no-scrollbar px-4 py-3 pb-1 border-b border-border-subtle md:px-6 md:border-b-0 md:bg-transparent">
        <div className="flex gap-2 w-max pb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "relative px-[18px] py-2 rounded-full font-figtree text-[13px] font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                selectedCategory === cat ? "text-card-white shadow-sm" : "text-text-muted border border-border-subtle bg-card-white/40 hover:border-brand-primary hover:text-brand-primary hover:bg-card-white"
              )}
            >
              {selectedCategory === cat && (
                <motion.span
                  layoutId="activeCategoryBubble"
                  className="absolute inset-0 bg-royal-gradient rounded-full -z-10 shadow-[0_4px_12px_rgba(46,91,255,0.18)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER ROW */}
      <div className="overflow-x-auto no-scrollbar px-4 py-2 border-b border-border-subtle bg-card-white md:px-6 md:border-b-0 md:bg-transparent md:py-3">
        <div className="flex gap-2 w-max items-center">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpenOnly(!openOnly)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-figtree text-[13px] font-semibold border transition-all duration-200 cursor-pointer",
              openOnly 
                ? "bg-[#ECFDF5] text-[#059669] border-[#059669]" 
                : "bg-card-white text-text-muted border-border-subtle hover:border-brand-primary/50"
            )}
          >
            {openOnly && <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />}
            Open now
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              const next = sortBy === "distance" ? "rating" : sortBy === "rating" ? "reviews" : "distance";
              setSortBy(next);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-figtree text-[13px] font-medium border transition-all duration-200 cursor-pointer",
              sortBy !== "distance"
                ? "bg-tag-bg text-brand-primary border-brand-primary font-semibold"
                : "bg-card-white text-text-muted border-border-subtle hover:border-brand-primary/50"
            )}
          >
            <span className="capitalize">{sortBy === "distance" ? "Nearest" : sortBy === "rating" ? "Top Rated" : "Most Reviewed"}</span>
            <ChevronDown size={14} />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              setTempDistance(maxDistance);
              setDistanceSheetOpen(true);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-figtree text-[13px] font-medium border transition-all duration-200 cursor-pointer",
              maxDistance < 6
                ? "bg-tag-bg text-brand-primary border-brand-primary font-semibold"
                : "bg-card-white text-text-muted border-border-subtle hover:border-brand-primary/50"
            )}
          >
            <span>Within {maxDistance}km</span>
            <ChevronDown size={14} />
          </motion.button>
        </div>
      </div>

      {/* RESULTS COUNT & CLEAR */}
      <div className="flex justify-between items-center px-4 py-4 md:px-6 md:py-5">
        <span className="font-figtree text-[13px] text-text-muted">
          Showing {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''}
        </span>
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={clearFilters}
              className="text-brand-primary border border-brand-primary px-3.5 py-1 rounded-full font-figtree text-[12px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-tag-bg"
            >
              Clear all <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* GRID */}
      <div className="px-4">
        {loading || isFetchingShops ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredShops.length > 0 ? (
          <motion.ul
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </motion.ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-4 text-border-subtle"
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                <circle cx="10" cy="10" r="3"></circle>
                <line x1="12.1" y1="12.1" x2="16" y2="16"></line>
              </svg>
            </motion.div>
            <h3 className="font-outfit font-bold text-[18px] text-ink-dark mb-1">No shops found</h3>
            <p className="font-figtree text-[14px] text-text-muted mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="bg-tag-bg text-brand-primary px-5 py-2 rounded-full font-figtree text-[14px] font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* AREA SHEET */}
      <BottomSheet
        isOpen={areaSheetOpen}
        onClose={() => setAreaSheetOpen(false)}
        title="Select area"
      >
        <div className="flex flex-col mt-2">
          <button
            onClick={() => { setSelectedArea(""); setAreaSheetOpen(false); }}
            className="flex items-center justify-between py-3 border-b border-border-subtle/50"
          >
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-text-muted" />
              <span className="font-figtree text-[15px] font-medium text-ink-dark">All Areas</span>
            </div>
            {selectedArea === "" && <Check size={18} className="text-brand-primary" />}
          </button>
          
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => { setSelectedArea(area); setAreaSheetOpen(false); }}
              className="flex items-center justify-between py-3 border-b border-border-subtle/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-text-muted" />
                <span className="font-figtree text-[15px] font-medium text-ink-dark">{area}</span>
              </div>
              {selectedArea === area && <Check size={18} className="text-brand-primary" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* DISTANCE SHEET */}
      <BottomSheet
        isOpen={distanceSheetOpen}
        onClose={() => setDistanceSheetOpen(false)}
        title="Search radius"
      >
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="font-outfit font-extrabold text-[32px] text-brand-primary mb-6">
            {tempDistance} <span className="text-[20px] text-text-muted font-figtree font-medium">km</span>
          </div>
          
          <input
            type="range"
            min="0.5"
            max="6"
            step="0.5"
            value={tempDistance}
            onChange={(e) => setTempDistance(parseFloat(e.target.value))}
            className="w-full h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
          <div className="w-full flex justify-between text-text-muted text-[12px] font-figtree mt-2 mb-8">
            <span>0.5km</span>
            <span>6.0km</span>
          </div>
          
          <button
            onClick={() => {
              setMaxDistance(tempDistance);
              setDistanceSheetOpen(false);
            }}
            className="w-full bg-royal-gradient text-card-white rounded-full font-figtree font-semibold text-[15px] py-3.5 hover:shadow-[0_6px_20px_rgba(46,91,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
