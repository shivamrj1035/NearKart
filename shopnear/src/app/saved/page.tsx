"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSavedShops } from "@/hooks/useSavedShops";
import { shops } from "@/data/shops";
import { ShopCard } from "@/components/ui/ShopCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import Link from "next/link";
import { Heart, Search } from "lucide-react";

export default function SavedPage() {
  const { savedIds } = useSavedShops();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const savedShops = shops.filter((s) => savedIds.includes(s.id));

  return (
    <div className="flex-1 bg-page-bg pb-24 min-h-screen">
      {/* Sticky Header */}
      <div className="px-4 py-5 sticky top-0 z-10 bg-page-bg/80 backdrop-blur-md border-b border-border-subtle/50 flex justify-between items-center">
        <div>
          <h1 className="font-outfit font-extrabold text-[22px] text-ink-dark leading-none">
            Saved Shops
          </h1>
          <p className="font-figtree text-[14px] text-text-muted mt-1.5">
            Your bookmarked physical stores
          </p>
        </div>
        {mounted && savedShops.length > 0 && (
          <span className="bg-soft-cloudy-gradient border border-brand-primary/5 text-brand-primary font-figtree text-[13px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-xs">
            <Heart size={14} className="fill-brand-primary text-brand-primary" />
            {savedShops.length} {savedShops.length === 1 ? "Shop" : "Shops"}
          </span>
        )}
      </div>

      <div className="p-4">
        {!mounted ? (
          // Skeleton loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : savedShops.length === 0 ? (
          // Beautiful Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-tag-bg flex items-center justify-center mb-5 text-brand-primary">
              <Heart size={28} className="text-brand-primary" />
            </div>
            <h2 className="font-outfit font-bold text-[18px] text-ink-dark mb-2">
              No saved shops yet
            </h2>
            <p className="font-figtree text-[14px] text-text-muted max-w-sm mb-6 leading-relaxed">
              Bookmark your favorite physical stores to access their contact details, hours, and catalog anytime.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-royal-gradient text-card-white font-figtree font-semibold text-[14px] px-6 py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(46,91,255,0.2)] hover:shadow-[0_6px_20px_rgba(46,91,255,0.3)] cursor-pointer"
            >
              <Search size={16} />
              <span>Explore Nearby Shops</span>
            </Link>
          </motion.div>
        ) : (
          // Grid list
          <motion.ul
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {savedShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
}
