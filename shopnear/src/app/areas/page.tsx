"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Search, X } from "lucide-react";
import { shops } from "@/data/shops";
import { categoryColorMap } from "@/lib/utils";

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
    transition: { staggerChildren: 0.04 },
  },
};

const areaVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
} as any;

export default function AreasPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAreas = AREAS.filter((area) =>
    area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-page-bg pb-24">
      {/* Sticky Header with Search */}
      <div className="px-4 py-4 sticky top-0 z-10 bg-page-bg/85 backdrop-blur-md border-b border-border-subtle/50 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-outfit font-extrabold text-[22px] text-ink-dark leading-none">
              Browse by area
            </h1>
            <p className="font-figtree text-[13px] text-text-muted mt-1.5">
              Explore shops in each neighbourhood
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-card-white border border-border-subtle rounded-xl font-figtree text-[14px] text-ink-dark focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all placeholder:text-text-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-ink-dark transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {filteredAreas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-12 text-center">
          <MapPin size={40} className="text-text-muted/40 mb-3" />
          <h3 className="font-outfit font-bold text-[16px] text-ink-dark">No areas found</h3>
          <p className="font-figtree text-[13px] text-text-muted mt-1 max-w-[240px]">
            We couldn't find any areas matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredAreas.map((area) => {
              const areaShops = shops.filter((s) => s.area === area);
              const categories = Array.from(new Set(areaShops.map((s) => s.category))).slice(0, 3);
              
              return (
                <motion.div 
                  key={area} 
                  variants={areaVariants}
                  layout
                  exit="exit"
                >
                  <Link href={`/?area=${encodeURIComponent(area)}`}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 12px 32px rgba(46,91,255,0.1)",
                        borderColor: "var(--color-brand-primary)"
                      }}
                      className="bg-card-white border border-border-subtle rounded-[20px] p-4 shadow-sm h-full flex flex-col transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="font-outfit font-bold text-[16px] text-ink-dark">
                          {area}
                        </h2>
                        <span className="bg-soft-cloudy-gradient border border-brand-primary/5 text-brand-primary font-figtree text-[12px] px-2.5 py-1 rounded-full font-bold shadow-xs">
                          {areaShops.length} shop{areaShops.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
                        {categories.map((cat) => {
                          const colors = categoryColorMap[cat] || { bg: "#F1F5F9", text: "#475569" };
                          return (
                            <span
                              key={cat}
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                              className="font-figtree text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                            >
                              {cat}
                            </span>
                          );
                        })}
                        {categories.length === 0 && (
                          <span className="text-text-muted font-figtree text-[12px] italic">No shops currently</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-brand-primary font-figtree text-[13px] font-medium mt-auto">
                        Browse shops <ArrowRight size={14} />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
