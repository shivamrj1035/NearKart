"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Grid, Heart, Info, User, Star, ChevronDown } from "lucide-react";
import { useSavedShops } from "@/hooks/useSavedShops";
import { motion } from "framer-motion";
import { useLocationStore } from "@/store/useLocationStore";
import LocationModal from "./LocationModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { savedIds } = useSavedShops();
  const { selectedCity, selectedArea, setLocationModalOpen } = useLocationStore();

  const navItems = [
    { name: "Discover", href: "/", icon: Home },
    { name: "Areas", href: "/areas", icon: MapPin },
    { name: "Categories", href: "/categories", icon: Grid },
    { name: "Saved Shops", href: "/saved", icon: Heart, badge: savedIds.length },
    { name: "About Us", href: "/about", icon: Info },
  ];

  return (
    <div className="min-h-screen flex bg-page-bg font-figtree">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 bg-card-white border-r border-border-subtle fixed h-screen z-30">
        {/* Brand Header */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-border-subtle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#2563EB" />
            <path d="M10.5 7.5C10.5 8.33 11.17 9 12 9C12.83 9 13.5 8.33 13.5 7.5C13.5 6.67 12.83 6 12 6C11.17 6 10.5 6.67 10.5 7.5Z" fill="#F59E0B" />
          </svg>
          <div className="flex select-none">
            <span className="font-outfit font-black text-[22px] text-brand-primary leading-none">Shop</span>
            <span className="font-outfit font-black text-[22px] text-brand-gold leading-none">Near</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} className="block">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-tag-bg text-brand-primary font-semibold shadow-sm"
                    : "text-text-muted hover:text-ink-dark hover:bg-page-bg/50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? "text-brand-primary" : "text-text-muted"} />
                    <span className="text-[14px]">{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-brand-primary text-card-white" : "bg-tag-bg text-brand-primary"
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-subtle bg-page-bg/30 text-center">
          <div className="text-[11px] text-text-muted">
            ShopNear Explorer v1.2.0
          </div>
          <div className="text-[10px] text-text-muted/75 mt-0.5">
            © 2026 ShopNear Platform
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 min-w-0 flex flex-col md:pl-72 min-h-screen">
        {/* MOBILE HEADER */}
        <header className="sticky top-0 z-40 bg-card-white border-b border-border-subtle shadow-sm flex md:hidden items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-1.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#2563EB" />
              <path d="M10.5 7.5C10.5 8.33 11.17 9 12 9C12.83 9 13.5 8.33 13.5 7.5C13.5 6.67 12.83 6 12 6C11.17 6 10.5 6.67 10.5 7.5Z" fill="#F59E0B" />
            </svg>
            <div className="flex select-none">
              <span className="font-outfit font-extrabold text-[20px] text-brand-primary leading-none">Shop</span>
              <span className="font-outfit font-extrabold text-[20px] text-brand-gold leading-none">Near</span>
            </div>
          </Link>

          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1 bg-tag-bg text-brand-primary px-3.5 py-2 rounded-full font-figtree font-bold text-[12px] cursor-pointer hover:bg-brand-primary/10 transition-colors"
          >
            <MapPin size={13} className="text-brand-primary" />
            <span className="max-w-[110px] truncate">{selectedArea || selectedCity}</span>
            <ChevronDown size={12} className="text-brand-primary/75" />
          </button>
        </header>

        {/* DESKTOP TOP NAV HEADER */}
        <header className="hidden md:flex items-center justify-between h-20 px-8 bg-card-white border-b border-border-subtle sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-outfit font-bold text-lg text-ink-dark">
                {pathname === "/" ? "Discover Local Stores" :
                  pathname === "/areas" ? "Areas Directory" :
                    pathname === "/categories" ? "Shop Categories" :
                      pathname === "/saved" ? "Your Bookmarks" : "About ShopNear"}
              </h2>
              <p className="text-[12px] text-text-muted mt-0.5">
                Find the right physical store for any product.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Global Location Selector Button in Desktop Header */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-2 bg-page-bg hover:bg-tag-bg text-ink-dark hover:text-brand-primary border border-border-subtle hover:border-brand-primary/40 px-4 py-2.5 rounded-full font-figtree font-semibold text-[13px] transition-all cursor-pointer shadow-sm shrink-0"
            >
              <MapPin size={15} className="text-brand-primary" />
              <span>{selectedArea ? `${selectedArea}, ${selectedCity}` : selectedCity}</span>
              <ChevronDown size={14} className="text-text-muted" />
            </button>

            <div className="h-6 w-[1px] bg-border-subtle" />

            {/* Horizontal menu */}
            <nav className="flex items-center gap-6">
              {[
                { name: "Home", href: "/" },
                { name: "Areas", href: "/areas" },
                { name: "Categories", href: "/categories" },
                { name: "About Us", href: "/about" },
              ].map((link) => {
                const isLinkActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[14px] font-medium transition-colors ${isLinkActive
                      ? "text-brand-primary"
                      : "text-text-muted hover:text-brand-primary"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="h-6 w-[1px] bg-border-subtle" />

            {/* Saved button and profile */}
            <div className="flex items-center gap-3">
              <Link href="/saved">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 bg-page-bg text-text-muted hover:text-brand-primary hover:bg-tag-bg rounded-full transition-all duration-200"
                >
                  <Heart size={20} className={savedIds.length > 0 ? "fill-brand-primary text-brand-primary" : ""} />
                  {savedIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-primary text-card-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-card-white animate-pulse">
                      {savedIds.length}
                    </span>
                  )}
                </motion.div>
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-[13px] font-semibold text-ink-dark">Local Guest</span>
                  <span className="text-[10px] text-[#10B981] font-medium flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" /> Online
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-primary text-card-white font-outfit font-bold flex items-center justify-center shadow-sm select-none">
                  LG
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>

      {/* Global Location Modal */}
      <LocationModal />
    </div>
  );
}
