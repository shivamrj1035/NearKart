import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categoryColorMap: Record<string, { bg: string; text: string }> = {
  Electronics: { bg: "#EFF6FF", text: "#2563EB" },
  Clothing: { bg: "#F5F3FF", text: "#7C3AED" },
  Hardware: { bg: "#F1F5F9", text: "#475569" },
  Books: { bg: "#ECFDF5", text: "#059669" },
  Jewellery: { bg: "#FFFBEB", text: "#D97706" },
  Grocery: { bg: "#F0FDF4", text: "#16A34A" },
  Furniture: { bg: "#FAF5FF", text: "#9333EA" },
  Pharmacy: { bg: "#FFF1F2", text: "#E11D48" },
  "Art & Craft": { bg: "#FFF7ED", text: "#EA580C" },
  Sports: { bg: "#F0FDFA", text: "#0D9488" },
  "Home & Kitchen": { bg: "#EFF6FF", text: "#2563EB" },
  "Pet Supplies": { bg: "#FFF7ED", text: "#EA580C" },
  Automotive: { bg: "#F8FAFC", text: "#64748B" },
  Garden: { bg: "#F0FDF4", text: "#16A34A" },
};

export function getPriceLabel(price: number): string {
  if (price === 1) return "₹";
  if (price === 2) return "₹₹";
  if (price === 3) return "₹₹₹";
  if (price === 4) return "₹₹₹₹";
  return "₹";
}
