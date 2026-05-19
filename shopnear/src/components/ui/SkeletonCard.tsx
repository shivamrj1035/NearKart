"use client";

import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="bg-card-white border border-border-subtle rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="block p-4 h-full flex flex-col">
        {/* Badges row */}
        <div className="flex justify-between items-center mb-2.5">
          <div className="w-20 h-6 rounded-full animate-shimmer" />
          <div className="w-16 h-6 rounded-full animate-shimmer" />
        </div>

        {/* Title */}
        <div className="w-3/4 h-5 rounded-md animate-shimmer mb-1.5 mt-1" />

        {/* Rating row */}
        <div className="w-2/3 h-4 rounded-md animate-shimmer mb-1.5" />

        {/* Price + hours */}
        <div className="w-1/2 h-4 rounded-md animate-shimmer mb-2.5" />

        {/* Specialty */}
        <div className="w-full h-4 rounded-md animate-shimmer mb-3" />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          <div className="w-16 h-6 rounded-full animate-shimmer" />
          <div className="w-20 h-6 rounded-full animate-shimmer" />
          <div className="w-14 h-6 rounded-full animate-shimmer" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <div className="flex-1 h-9 rounded-full animate-shimmer" />
          <div className="flex-[2] h-9 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
