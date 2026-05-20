"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft, Share2, Phone, MapPin, Clock, Navigation } from "lucide-react";
import { shops } from "@/features/shops/data/shops";
import { StatusPill } from "@/features/shops/components/ShopBadges";
import { MiniShopCard } from "@/features/shops/components/MiniShopCard";
import { getPriceLabel } from "@/lib/utils";

const tagContainer = {
  animate: {
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
};

const tagItem = {
  initial: { opacity: 0, scale: 0.82 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 28 } },
} satisfies Variants;

export default function ShopDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isToastOpen, setIsToastOpen] = useState(false);

  const shopId = Number(params?.id);
  const shop = shops.find((s) => s.id === shopId);

  if (!shop) {
    notFound();
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shop?.name,
          text: `Check out ${shop?.name} on ShopNear`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsToastOpen(true);
        setTimeout(() => setIsToastOpen(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!shop) return null;

  const similarShops = shops.filter((s) => s.area === shop.area && s.id !== shop.id);

  return (
    <div className="flex-1 pb-[100px] md:pb-16 bg-page-bg">
      {/* TOAST */}
      <AnimatePresence>
        {isToastOpen && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-ink-dark text-page-bg px-4 py-2 rounded-full font-figtree text-[14px] z-50 shadow-lg"
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner with floating overlays */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src="/images/default_shop_thumbnail.png"
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        
        {/* Floating actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors shadow-sm"
          >
            <Share2 size={20} />
          </motion.button>
        </div>

        {/* Floating identity on top of banner */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <div className="flex gap-2 mb-2">
            <span className="bg-royal-gradient text-card-white font-figtree text-[11px] px-2.5 py-1 rounded-full font-semibold shadow-sm">
              {shop.category}
            </span>
            <StatusPill open={shop.open} />
          </div>
          <h1 className="font-outfit font-black text-2xl md:text-3xl tracking-tight leading-tight drop-shadow-md">
            {shop.name}
          </h1>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="p-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Main shop details & Metadata (span 2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Identity/Overview card */}
            <div className="bg-card-white border border-border-subtle rounded-[20px] p-5 shadow-xs">
              <h2 className="font-outfit font-extrabold text-[22px] text-ink-dark leading-tight mb-2">
                About the Store
              </h2>
              
              <div className="flex items-center gap-1.5 font-figtree text-[13px] text-text-muted mb-4">
                <span className="text-brand-gold">★</span>
                <span className="text-ink-dark font-semibold">{shop.rating}</span>
                <span>·</span>
                <span>{shop.reviews} reviews</span>
                <span>·</span>
                <span>{shop.distance}km away</span>
              </div>
              
              <div className="border-l-[3px] border-brand-gold pl-3 py-0.5">
                <p className="font-figtree italic text-[14px] text-brand-gold leading-relaxed">
                  {shop.specialty}
                </p>
              </div>
            </div>

            {/* INFO GRID - refined styling */}
            <div className="grid grid-cols-2 gap-3.5">
              <a 
                href={`tel:${shop.phone}`} 
                className="bg-card-white border border-border-subtle rounded-[20px] p-4 flex flex-col gap-2 hover:border-brand-primary hover:shadow-[0_8px_24px_rgba(46,91,255,0.08)] transition-all duration-300 group shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-tag-bg flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-figtree text-[11px] text-text-muted block">Phone Number</span>
                  <span className="font-figtree text-[14px] text-ink-dark font-semibold group-hover:text-brand-primary transition-colors">{shop.phone}</span>
                </div>
              </a>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.area} ${shop.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-card-white border border-border-subtle rounded-[20px] p-4 flex flex-col gap-2 hover:border-brand-primary hover:shadow-[0_8px_24px_rgba(46,91,255,0.08)] transition-all duration-300 group shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-tag-bg flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="font-figtree text-[11px] text-text-muted block">Location</span>
                  <span className="font-figtree text-[14px] text-ink-dark font-semibold truncate block group-hover:text-brand-primary transition-colors">{shop.area}, {shop.city}</span>
                </div>
              </a>

              <div className="bg-card-white border border-border-subtle rounded-[20px] p-4 flex flex-col gap-2 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-tag-bg flex items-center justify-center text-brand-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="font-figtree text-[11px] text-text-muted block">Business Hours</span>
                  <span className="font-figtree text-[14px] text-ink-dark font-semibold">{shop.hours}</span>
                </div>
              </div>

              <div className="bg-card-white border border-border-subtle rounded-[20px] p-4 flex flex-col gap-2 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-brand-gold font-outfit font-bold text-[16px]">
                  {getPriceLabel(shop.price)}
                </div>
                <div>
                  <span className="font-figtree text-[11px] text-text-muted block">Price Range</span>
                  <span className="font-figtree text-[14px] text-ink-dark font-semibold">
                    {shop.price === 1 ? "Budget (₹)" : shop.price === 2 ? "Moderate (₹₹)" : shop.price === 3 ? "Premium (₹₹₹)" : "Luxury (₹₹₹₹)"}
                  </span>
                </div>
              </div>
            </div>

            {/* PRODUCT TAGS */}
            <div className="bg-card-white border border-border-subtle rounded-[20px] p-5 shadow-xs">
              <h3 className="font-outfit font-bold text-[16px] text-ink-dark mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-royal-gradient rounded-full" />
                Products &amp; Items Carried
              </h3>
              <motion.div
                variants={tagContainer}
                initial="initial"
                animate="animate"
                className="flex flex-wrap gap-2"
              >
                {shop.products.map((product) => (
                  <motion.span
                    key={product}
                    variants={tagItem}
                    className="bg-tag-bg text-brand-primary font-figtree text-[13px] px-3.5 py-1.5 rounded-xl font-semibold border border-brand-primary/5 hover:bg-brand-primary hover:text-white hover:shadow-[0_4px_12px_rgba(46,91,255,0.15)] transition-all duration-200 cursor-default"
                  >
                    {product}
                  </motion.span>
                ))}
              </motion.div>
            </div>

          </div>

          {/* RIGHT COLUMN: Known for, Actions & Similar Shops (span 1) */}
          <div className="space-y-6">
            
             {/* Desktop Action Buttons Card */}
            <div className="hidden md:block bg-card-white border border-border-subtle rounded-[20px] p-5 shadow-xs space-y-3">
              <h3 className="font-outfit font-bold text-[15px] text-ink-dark mb-2">Shop Actions</h3>
              
              <a
                href={`tel:${shop.phone}`}
                className="flex justify-center items-center gap-2 w-full bg-white border border-brand-primary/30 text-brand-primary rounded-xl font-figtree text-[14px] font-bold py-2.5 hover:border-brand-primary hover:bg-tag-bg transition-all duration-200 shadow-xs cursor-pointer"
              >
                <Phone size={14} /> Call Store
              </a>
              
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.area} ${shop.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center gap-2 w-full bg-white border border-brand-primary/30 text-brand-primary rounded-xl font-figtree text-[14px] font-bold py-2.5 hover:border-brand-primary hover:bg-tag-bg transition-all duration-200 shadow-xs cursor-pointer"
              >
                <Navigation size={14} /> Get Directions
              </a>
              
              <button
                onClick={handleShare}
                className="flex justify-center items-center gap-2 w-full bg-royal-gradient text-card-white rounded-xl font-figtree text-[14px] font-bold py-2.5 hover:shadow-[0_6px_20px_rgba(46,91,255,0.25)] transition-all duration-200 shadow-md cursor-pointer"
              >
                <Share2 size={14} /> Share Shop
              </button>
            </div>

            {/* Special Highlight Box ("What they're known for") */}
            <div className="bg-[#FFFDF4] border border-amber-200/50 rounded-[20px] p-5 shadow-xs relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-brand-gold/10 font-serif text-[120px] select-none pointer-events-none font-bold leading-none">“</div>
              <h3 className="font-outfit font-bold text-[13px] text-brand-gold uppercase tracking-wider mb-2">
                What they&apos;re known for
              </h3>
              <p className="font-figtree italic text-[15px] text-ink-dark leading-relaxed relative z-10">
                &quot;{shop.specialty}&quot;
              </p>
            </div>

            {/* More shops in this area */}
            {similarShops.length > 0 && (
              <div className="bg-card-white border border-border-subtle rounded-[20px] p-5 shadow-xs">
                <h3 className="font-outfit font-bold text-[15px] text-ink-dark mb-3.5 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-royal-gradient rounded-full" />
                  Nearby in {shop.area}
                </h3>
                <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar snap-x">
                  {similarShops.map((s) => (
                    <div key={s.id} className="snap-start shrink-0">
                      <MiniShopCard shop={s} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.3, type: "spring", stiffness: 300, damping: 30 } }}
        className="fixed bottom-0 left-0 right-0 bg-card-white/95 backdrop-blur-md border-t border-border-subtle p-3 pb-[calc(12px+env(safe-area-inset-bottom))] z-40 md:hidden"
      >
        <div className="flex gap-2 max-w-lg mx-auto">
          <a
            href={`tel:${shop.phone}`}
            className="flex-1 flex justify-center items-center gap-1.5 border border-brand-primary/30 text-brand-primary rounded-full font-figtree text-[13px] font-bold py-3 shadow-xs active:bg-tag-bg transition-colors"
          >
            <Phone size={14} /> Call
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.area} ${shop.city}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex justify-center items-center gap-1.5 border border-brand-primary/30 text-brand-primary rounded-full font-figtree text-[13px] font-bold py-3 shadow-xs active:bg-tag-bg transition-colors"
          >
            <Navigation size={14} /> Directions
          </a>
          <button
            onClick={handleShare}
            className="flex-1 flex justify-center items-center gap-1.5 bg-royal-gradient text-card-white rounded-full font-figtree text-[13px] font-bold py-3 shadow-md active:shadow-sm transition-all duration-200"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </motion.div>
    </div>
  );
}
