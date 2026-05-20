"use client";

import { Home, MapPin, Heart, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSavedShops } from "@/features/saved/hooks/useSavedShops";

export default function BottomNav() {
  const pathname = usePathname();
  const { savedIds } = useSavedShops();

  const navItems = [
    { name: "Discover", href: "/", icon: Home },
    { name: "Areas", href: "/areas", icon: MapPin },
    { name: "Saved", href: "/saved", icon: Heart, badge: savedIds.length },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-card-white border-t border-border-subtle z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="flex-1 flex justify-center">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 relative"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={isActive ? "text-brand-primary fill-brand-primary/10" : "text-text-muted"}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-brand-primary text-card-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-card-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-figtree font-semibold ${
                    isActive ? "text-brand-primary" : "text-text-muted"
                  }`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-1 h-1 bg-brand-primary rounded-full absolute -bottom-2"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
