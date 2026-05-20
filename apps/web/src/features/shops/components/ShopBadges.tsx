import { motion } from "framer-motion";
import { categoryColorMap } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CategoryBadge({ category }: { category: string }) {
  const colors = categoryColorMap[category] || { bg: "#EAF3EE", text: "#1B4332" };
  return (
    <span
      className="px-3 py-1 text-[11px] font-figtree font-medium rounded-full whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  );
}

export function StatusPill({ open }: { open: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-figtree font-semibold transition-colors duration-200",
        open ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F1F5F9] text-text-muted"
      )}
    >
      {open ? (
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-[#059669]"
        />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
      )}
      {open ? "Open" : "Closed"}
    </div>
  );
}
