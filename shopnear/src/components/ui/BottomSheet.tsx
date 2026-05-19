"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100]"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 350, damping: 35 },
            }}
            exit={{ y: "100%", opacity: 0 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:rounded-2xl bg-card-white rounded-t-[24px] z-[101] shadow-2xl pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex justify-center p-3 md:hidden">
              <div className="w-12 h-1.5 bg-border-subtle rounded-full" />
            </div>
            
            {title && (
              <div className="px-6 pb-2 pt-1">
                <h2 className="font-outfit font-bold text-base text-ink-dark">
                  {title}
                </h2>
              </div>
            )}
            
            <div className="max-h-[80vh] overflow-y-auto px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
