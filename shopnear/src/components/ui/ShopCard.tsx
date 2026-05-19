"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shop } from "@/data/shops";
import { CategoryBadge, StatusPill } from "./ShopBadges";
import { getPriceLabel } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useSavedShops } from "@/hooks/useSavedShops";

const itemVariants = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
} as any;

export function ShopCard({ shop }: { shop: Shop }) {
  const { isSaved, toggleSave } = useSavedShops();
  const saved = isSaved(shop.id);
  const displayTags = shop.products.slice(0, 3);
  const extraTagsCount = shop.products.length - 3;

  return (
    <motion.li
      variants={itemVariants}
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(37,99,235,0.08)" }}
      className="bg-card-white border border-border-subtle rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] list-none overflow-hidden relative transition-shadow duration-200"
    >
      <Link href={`/shop/${shop.id}`} className="block h-full flex flex-col">
        {/* Thumbnail Image Container */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src="/images/default_shop_thumbnail.png"
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Overlay elements */}
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge category={shop.category} />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <StatusPill open={shop.open} />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(shop.id);
              }}
              className="p-1.5 rounded-full bg-card-white/90 backdrop-blur-xs hover:bg-card-white transition-colors text-text-muted hover:text-brand-primary shadow-sm flex items-center justify-center"
              title={saved ? "Remove from Saved" : "Save Shop"}
            >
              <Heart
                size={16}
                className={saved ? "fill-brand-primary text-brand-primary" : "text-text-muted"}
              />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-outfit font-bold text-base text-ink-dark mb-1">
            {shop.name}
          </h3>

          <div className="flex items-center gap-1.5 font-figtree text-[13px] text-text-muted mb-1">
            <span className="text-brand-gold">★</span>
            <span className="font-semibold text-ink-dark">{shop.rating}</span>
            <span>·</span>
            <span>{shop.reviews} reviews</span>
            <span>·</span>
            <span>{shop.distance}km</span>
          </div>

          <div className="font-figtree text-[13px] text-text-muted mb-2">
            {getPriceLabel(shop.price)} · {shop.hours}
          </div>

          <p className="font-figtree italic text-[13px] text-brand-gold truncate mb-2.5">
            {shop.specialty}
          </p>

          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {displayTags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-tag-bg text-brand-primary font-figtree text-[12px] px-2.5 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {extraTagsCount > 0 && (
              <span className="bg-tag-bg text-brand-primary font-figtree text-[12px] px-2.5 py-1 rounded-full font-medium">
                +{extraTagsCount} more
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `tel:${shop.phone}`;
              }}
              className="flex-1 border border-brand-primary text-brand-primary rounded-full font-figtree text-[13px] font-medium py-2 text-center hover:bg-tag-bg transition-colors"
            >
              📞 Call
            </button>
            <div className="flex-[2] bg-brand-primary text-card-white rounded-full font-figtree text-[13px] font-medium py-2 text-center flex items-center justify-center hover:bg-brand-primary/95 transition-colors">
              View Details →
            </div>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
