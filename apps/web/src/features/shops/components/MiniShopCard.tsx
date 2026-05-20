"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shop } from "@/features/shops/data/shops";
import { CategoryBadge, StatusPill } from "./ShopBadges";

export function MiniShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shop/${shop.id}`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(46,91,255,0.1)", borderColor: "var(--color-brand-primary)" }}
        className="bg-card-white border border-border-subtle rounded-2xl w-[180px] shrink-0 overflow-hidden flex flex-col transition-all duration-300"
      >
        {/* Thumbnail Image Container */}
        <div className="relative h-24 w-full bg-slate-100 overflow-hidden">
          <img
            src="/images/default_shop_thumbnail.png"
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Overlay Category Badge */}
          <div className="absolute top-2 left-2 z-10 scale-90 origin-top-left">
            <CategoryBadge category={shop.category} />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 flex-1 flex flex-col gap-1">
          <h4 className="font-outfit font-semibold text-[14px] text-ink-dark truncate">
            {shop.name}
          </h4>
          
          <div className="flex items-center gap-1 font-figtree text-[12px] text-text-muted">
            <span className="text-brand-gold">★</span>
            <span className="font-semibold text-ink-dark">{shop.rating}</span>
            <span>·</span>
            <span>{shop.distance}km</span>
          </div>
          
          <div className="mt-1 flex items-center justify-between">
            <StatusPill open={shop.open} />
            <span className="font-figtree text-[11px] text-text-muted">{shop.area}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
