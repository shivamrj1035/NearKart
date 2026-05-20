"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Wrench,
  BookOpen,
  Gem,
  ShoppingBag,
  Sofa,
  Pill,
  Palette,
  Trophy,
  Utensils,
  Dog,
  Car,
  Leaf,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import { shops } from "@/features/shops/data/shops";
import { categoryColorMap } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Electronics: Smartphone,
  Clothing: Shirt,
  Hardware: Wrench,
  Books: BookOpen,
  Jewellery: Gem,
  Grocery: ShoppingBag,
  Furniture: Sofa,
  Pharmacy: Pill,
  "Art & Craft": Palette,
  Sports: Trophy,
  "Home & Kitchen": Utensils,
  "Pet Supplies": Dog,
  Automotive: Car,
  Garden: Leaf,
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
} satisfies Variants;

export default function CategoriesPage() {
  const categoriesList = Object.keys(categoryColorMap);

  return (
    <div className="flex-1 bg-page-bg pb-24 min-h-screen">
      {/* Sticky Header */}
      <div className="px-4 py-5 sticky top-0 z-10 bg-page-bg/80 backdrop-blur-md border-b border-border-subtle/50">
        <h1 className="font-outfit font-extrabold text-[22px] text-ink-dark leading-none">
          Browse by Category
        </h1>
        <p className="font-figtree text-[14px] text-text-muted mt-1.5">
          Find specific product types across local shops
        </p>
      </div>

      {/* Grid of Categories */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 p-4"
      >
        {categoriesList.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat] || ShoppingBag;
          const colors = categoryColorMap[cat] || { bg: "#EFF6FF", text: "#2563EB" };
          const matchingShopsCount = shops.filter((s) => s.category === cat).length;

          return (
            <motion.div key={cat} variants={cardVariants}>
              <Link href={`/?category=${encodeURIComponent(cat)}`}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(46,91,255,0.08)", borderColor: "var(--color-brand-primary)" }}
                  className="bg-card-white border border-border-subtle rounded-[20px] p-4.5 flex items-center justify-between cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Icon container with matching category colors */}
                    <div
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <div>
                      <h2 className="font-outfit font-bold text-[15px] text-ink-dark leading-tight">
                        {cat}
                      </h2>
                      <p className="font-figtree text-[12px] text-text-muted mt-0.5">
                        {matchingShopsCount} {matchingShopsCount === 1 ? "store" : "stores"} available
                      </p>
                    </div>
                  </div>

                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-page-bg transition-colors"
                    style={{ color: colors.text }}
                  >
                    <ArrowRight size={16} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
