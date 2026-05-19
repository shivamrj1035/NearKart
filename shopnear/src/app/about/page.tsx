"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info, HelpCircle, MapPin, Store, Sparkles, ShieldCheck } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does ShopNear work?",
    answer: "ShopNear is a local retail discovery platform. You can search for products, browse by category or area, and view details of physical stores. We provide everything you need—like coordinates, phone numbers, operating hours, and product lists—so you can visit the store directly with confidence.",
  },
  {
    question: "Can I order products for delivery on ShopNear?",
    answer: "No, ShopNear does not support delivery or online payments. It is purely a discovery and directory platform. Our mission is to help you locate items locally so you can support neighbourhood brick-and-mortar retailers and inspect products in person before purchasing.",
  },
  {
    question: "Are the product lists updated in real-time?",
    answer: "The listed catalog represents standard items and specialties that the store consistently carries. If you are looking for a highly specific item or want to verify stock level, we recommend clicking the phone button to call the store owner directly before making the trip.",
  },
  {
    question: "Is ShopNear free for shoppers and store owners?",
    answer: "Yes, ShopNear is 100% free. We charge no commissions, listing fees, or platform fees. Our goal is to make local retail discovery seamless and accessible for everyone.",
  },
];

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex-1 bg-page-bg pb-24 min-h-screen">
      {/* Sticky Header */}
      <div className="px-4 py-5 sticky top-0 z-10 bg-page-bg/80 backdrop-blur-md border-b border-border-subtle/50">
        <h1 className="font-outfit font-extrabold text-[22px] text-ink-dark leading-none">
          About ShopNear
        </h1>
        <p className="font-figtree text-[14px] text-text-muted mt-1.5">
          Bridging the gap between online search and offline retail
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Intro Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card-white border border-border-subtle rounded-[24px] p-6 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full flex items-center justify-center">
            <Info className="text-brand-primary opacity-20" size={32} />
          </div>
          <h2 className="font-outfit font-bold text-[18px] text-ink-dark mb-3">
            Our Mission
          </h2>
          <p className="font-figtree text-[14.5px] text-ink-dark leading-relaxed mb-4">
            We are creating a world where discovering physical products nearby is as simple as ordering food online. Whether you are a traveller looking for a specific adapter or a local searching for fresh regional organic millets, ShopNear guides you to the exact physical store that carries it.
          </p>
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[16px] p-4 flex gap-3 items-start">
            <Sparkles className="text-brand-primary flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="font-outfit font-bold text-[13px] text-brand-primary uppercase tracking-wider">
                Discovery first, no delivery fees
              </h3>
              <p className="font-figtree text-[13px] text-brand-primary/90 mt-1 leading-normal">
                Unlike delivery apps, we charge zero commission. ShopNear reconnects you with physical shopkeepers, giving you the power to touch, try, and buy directly.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div>
          <h2 className="font-outfit font-bold text-[15px] text-ink-dark mb-3 px-1 uppercase tracking-wider">
            Why ShopNear?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-card-white border border-border-subtle rounded-[18px] p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary">
                <MapPin size={18} />
              </div>
              <h3 className="font-outfit font-semibold text-[14px] text-ink-dark">
                Location Aware
              </h3>
              <p className="font-figtree text-[12.5px] text-text-muted leading-relaxed">
                Sort shops by exact distance in kilometres from your location.
              </p>
            </div>
            <div className="bg-card-white border border-border-subtle rounded-[18px] p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary">
                <Store size={18} />
              </div>
              <h3 className="font-outfit font-semibold text-[14px] text-ink-dark">
                Verified Catalogs
              </h3>
              <p className="font-figtree text-[12.5px] text-text-muted leading-relaxed">
                Know exactly what tags and items each shop keeper carries.
              </p>
            </div>
            <div className="bg-card-white border border-border-subtle rounded-[18px] p-4 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-outfit font-semibold text-[14px] text-ink-dark">
                Pure Platform
              </h3>
              <p className="font-figtree text-[12.5px] text-text-muted leading-relaxed">
                No middleman markup, no advertising bias, and no registration required.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion FAQ Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <HelpCircle size={18} className="text-ink-dark" />
            <h2 className="font-outfit font-bold text-[15px] text-ink-dark uppercase tracking-wider">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-card-white border border-border-subtle rounded-[16px] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                  >
                    <span className="font-outfit font-semibold text-[14.5px] text-ink-dark pr-4 leading-snug">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-text-muted flex-shrink-0"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-4 pt-0 border-t border-border-subtle/40">
                          <p className="font-figtree text-[13.5px] text-text-muted leading-relaxed pt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
