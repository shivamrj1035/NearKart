"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Navigation, Check, Loader2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationStore } from "@/store/useLocationStore";
import { cn } from "@/lib/utils";

// Cities list corresponding to useLocationStore
const CITIES = ["Vadodara", "Ahmedabad", "Mumbai", "Bengaluru"];

// Areas by city
const AREAS_BY_CITY: Record<string, string[]> = {
  Vadodara: ["Alkapuri", "Sayajigunj", "Fatehgunj", "Manjalpur", "Karelibaug", "Waghodia Rd", "Raopura", "Subhanpura"],
  Ahmedabad: ["Satellite", "Vastrapur", "C G Road", "Bodakdev"],
  Mumbai: ["Bandra", "Andheri", "Colaba", "Juhu"],
  Bengaluru: ["Indiranagar", "Koramangala", "Jayanagar", "Whitefield"],
};

export default function LocationModal() {
  const {
    selectedCity,
    selectedArea,
    isLocationModalOpen,
    isDetecting,
    detectedCity,
    detectedArea,
    setSelectedCity,
    setSelectedArea,
    setLocationModalOpen,
    detectLocation,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCityTab, setActiveCityTab] = useState(selectedCity);
  const [showDetectionBanner, setShowDetectionBanner] = useState(false);

  // Sync active tab with global selection when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      setActiveCityTab(selectedCity);
      setSearchQuery("");
      setShowDetectionBanner(false);
    }
  }, [isLocationModalOpen, selectedCity]);

  // Handle location detection
  const handleDetectLocation = async () => {
    const result = await detectLocation();
    if (result.success) {
      setActiveCityTab(result.city);
      setShowDetectionBanner(true);
      // Auto hide banner after 4 seconds
      setTimeout(() => setShowDetectionBanner(false), 4000);
    }
  };

  // Filter areas based on search query
  const filteredAreas = useMemo(() => {
    const areas = AREAS_BY_CITY[activeCityTab] || [];
    if (!searchQuery.trim()) return areas;
    return areas.filter((area) =>
      area.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCityTab, searchQuery]);

  if (!isLocationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLocationModalOpen(false)}
          className="fixed inset-0 bg-ink-dark/60 backdrop-blur-md"
        />

        {/* Modal Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative w-full max-w-2xl bg-card-white rounded-3xl overflow-hidden shadow-2xl border border-border-subtle flex flex-col max-h-[85vh] md:max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-card-white sticky top-0 z-10">
            <div>
              <h3 className="font-outfit font-bold text-xl text-ink-dark flex items-center gap-2">
                <MapPin size={22} className="text-brand-primary" />
                Select Location
              </h3>
              <p className="text-[12px] text-text-muted mt-0.5">
                Choose your city and neighborhood to discover nearby shops.
              </p>
            </div>
            <button
              onClick={() => setLocationModalOpen(false)}
              className="p-2 hover:bg-page-bg rounded-full text-text-muted hover:text-ink-dark transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Section (Scrollable) */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
            {/* Detection status banner */}
            <AnimatePresence>
              {showDetectionBanner && detectedCity && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Navigation size={18} className="text-brand-primary animate-pulse shrink-0" />
                    <div className="text-[13px] font-medium text-ink-dark">
                      We detected your location as <span className="font-semibold text-brand-primary">{detectedArea ? `${detectedArea}, ` : ""}{detectedCity}</span>.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCity(detectedCity);
                      if (detectedArea) setSelectedArea(detectedArea);
                      setShowDetectionBanner(false);
                    }}
                    className="bg-brand-primary text-card-white text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm shrink-0 cursor-pointer"
                  >
                    Use this
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Geolocation trigger & Search block */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Geolocation Button */}
              <button
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className={cn(
                  "flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl font-figtree font-semibold text-[14px] transition-all duration-200 shrink-0 border cursor-pointer",
                  isDetecting
                    ? "bg-page-bg text-text-muted border-border-subtle cursor-not-allowed"
                    : "bg-tag-bg text-brand-primary border-brand-primary/20 hover:bg-brand-primary hover:text-card-white hover:border-brand-primary hover:shadow-md"
                )}
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-brand-primary" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={16} className="fill-current" />
                    <span>Use Current Location</span>
                  </>
                )}
              </button>

              {/* Area search box */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder={`Search areas in ${activeCityTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl border border-border-subtle bg-page-bg/50 focus:bg-card-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-[14px] text-ink-dark outline-none font-figtree transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted hover:bg-border-subtle transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* City Tabs */}
            <div className="border-b border-border-subtle">
              <div className="flex gap-2 -mb-[1px] overflow-x-auto no-scrollbar pb-1">
                {CITIES.map((city) => {
                  const isActive = activeCityTab === city;
                  return (
                    <button
                      key={city}
                      onClick={() => {
                        setActiveCityTab(city);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "relative pb-3 px-4 font-outfit font-semibold text-[15px] transition-colors whitespace-nowrap cursor-pointer",
                        isActive ? "text-brand-primary" : "text-text-muted hover:text-ink-dark"
                      )}
                    >
                      {city}
                      {isActive && (
                        <motion.span
                          layoutId="cityTabLine"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map & Grid Content */}
            <div className="space-y-4">
              {/* Interactive SVG Neighborhood Map */}
              {!searchQuery && (CITIES.includes(activeCityTab)) && (
                <div className="bg-page-bg/40 border border-border-subtle rounded-3xl p-4 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-3 px-2">
                    <span className="text-[12px] font-semibold font-outfit text-ink-dark/80 tracking-wide uppercase">
                      Interactive Map: {activeCityTab}
                    </span>
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" /> Click to Select Area
                    </span>
                  </div>

                  <div className="relative w-full aspect-[320/260] max-w-md bg-card-white border border-border-subtle/60 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                    {/* SVG Map Grid Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* SVG drawing */}
                    <svg viewBox="0 0 320 260" className="w-full h-full select-none">
                      <g>
                        {/* Vadodara Map */}
                        {activeCityTab === "Vadodara" && (
                          <>
                            {/* Fatehgunj (North) */}
                            <g onClick={() => setSelectedArea("Fatehgunj")} className="group cursor-pointer">
                              <polygon
                                points="110,20 210,20 190,80 120,80"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Fatehgunj"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="157"
                                y="52"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200 text-center",
                                  selectedArea === "Fatehgunj" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Fatehgunj
                              </text>
                            </g>

                            {/* Karelibaug (North East) */}
                            <g onClick={() => setSelectedArea("Karelibaug")} className="group cursor-pointer">
                              <polygon
                                points="210,20 300,30 290,90 190,80"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Karelibaug"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="245"
                                y="58"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Karelibaug" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Karelibaug
                              </text>
                            </g>

                            {/* Subhanpura (West) */}
                            <g onClick={() => setSelectedArea("Subhanpura")} className="group cursor-pointer">
                              <polygon
                                points="15,90 100,95 90,155 10,145"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Subhanpura"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="53"
                                y="125"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Subhanpura" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Subhanpura
                              </text>
                            </g>

                            {/* Alkapuri (Central-West) */}
                            <g onClick={() => setSelectedArea("Alkapuri")} className="group cursor-pointer">
                              <polygon
                                points="100,95 170,95 170,155 90,155"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Alkapuri"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="130"
                                y="128"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Alkapuri" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Alkapuri
                              </text>
                            </g>

                            {/* Sayajigunj (Central) */}
                            <g onClick={() => setSelectedArea("Sayajigunj")} className="group cursor-pointer">
                              <polygon
                                points="170,95 230,95 220,155 170,155"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Sayajigunj"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="196"
                                y="128"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Sayajigunj" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Sayajigunj
                              </text>
                            </g>

                            {/* Raopura (Central-East) */}
                            <g onClick={() => setSelectedArea("Raopura")} className="group cursor-pointer">
                              <polygon
                                points="230,95 305,100 295,160 220,155"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Raopura"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="262"
                                y="132"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Raopura" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Raopura
                              </text>
                            </g>

                            {/* Manjalpur (South) */}
                            <g onClick={() => setSelectedArea("Manjalpur")} className="group cursor-pointer">
                              <polygon
                                points="90,155 180,155 170,235 60,225"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Manjalpur"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="122"
                                y="198"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Manjalpur" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Manjalpur
                              </text>
                            </g>

                            {/* Waghodia Road (South-East) */}
                            <g onClick={() => setSelectedArea("Waghodia Rd")} className="group cursor-pointer">
                              <polygon
                                points="180,155 295,160 280,240 170,235"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Waghodia Rd"
                                    ? "fill-brand-primary/25 stroke-brand-primary"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="230"
                                y="200"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Waghodia Rd" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Waghodia Rd
                              </text>
                            </g>
                          </>
                        )}

                        {/* Ahmedabad Map */}
                        {activeCityTab === "Ahmedabad" && (
                          <>
                            {/* Vastrapur (North West) */}
                            <g onClick={() => setSelectedArea("Vastrapur")} className="group cursor-pointer">
                              <polygon
                                points="20,20 160,20 150,130 20,110"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Vastrapur"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="85"
                                y="75"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Vastrapur" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Vastrapur
                              </text>
                            </g>

                            {/* Bodakdev (North East) */}
                            <g onClick={() => setSelectedArea("Bodakdev")} className="group cursor-pointer">
                              <polygon
                                points="160,20 300,20 300,130 150,130"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Bodakdev"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="225"
                                y="75"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Bodakdev" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Bodakdev
                              </text>
                            </g>

                            {/* Satellite (South West) */}
                            <g onClick={() => setSelectedArea("Satellite")} className="group cursor-pointer">
                              <polygon
                                points="20,110 150,130 140,240 20,240"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Satellite"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="80"
                                y="185"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Satellite" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Satellite
                              </text>
                            </g>

                            {/* C G Road (South East) */}
                            <g onClick={() => setSelectedArea("C G Road")} className="group cursor-pointer">
                              <polygon
                                points="150,130 300,130 280,240 140,240"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "C G Road"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="215"
                                y="185"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "C G Road" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                C G Road
                              </text>
                            </g>
                          </>
                        )}

                        {/* Mumbai Map */}
                        {activeCityTab === "Mumbai" && (
                          <>
                            {/* Andheri (North East) */}
                            <g onClick={() => setSelectedArea("Andheri")} className="group cursor-pointer">
                              <polygon
                                points="160,20 300,20 280,120 160,100"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Andheri"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="225"
                                y="65"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Andheri" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Andheri
                              </text>
                            </g>

                            {/* Bandra (North West) */}
                            <g onClick={() => setSelectedArea("Bandra")} className="group cursor-pointer">
                              <polygon
                                points="20,20 160,20 160,100 80,140"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Bandra"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="95"
                                y="70"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Bandra" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Bandra
                              </text>
                            </g>

                            {/* Juhu (South East) */}
                            <g onClick={() => setSelectedArea("Juhu")} className="group cursor-pointer">
                              <polygon
                                points="160,100 280,120 250,240 150,200"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Juhu"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="210"
                                y="165"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Juhu" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Juhu
                              </text>
                            </g>

                            {/* Colaba (South West) */}
                            <g onClick={() => setSelectedArea("Colaba")} className="group cursor-pointer">
                              <polygon
                                points="80,140 160,100 150,200 40,240"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Colaba"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="100"
                                y="175"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Colaba" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Colaba
                              </text>
                            </g>
                          </>
                        )}

                        {/* Bengaluru Map */}
                        {activeCityTab === "Bengaluru" && (
                          <>
                            {/* Indiranagar (North West) */}
                            <g onClick={() => setSelectedArea("Indiranagar")} className="group cursor-pointer">
                              <polygon
                                points="20,20 160,20 150,130 20,110"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Indiranagar"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="85"
                                y="75"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Indiranagar" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Indiranagar
                              </text>
                            </g>

                            {/* Whitefield (North East) */}
                            <g onClick={() => setSelectedArea("Whitefield")} className="group cursor-pointer">
                              <polygon
                                points="160,20 300,20 300,130 150,130"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Whitefield"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="225"
                                y="75"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Whitefield" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Whitefield
                              </text>
                            </g>

                            {/* Koramangala (South West) */}
                            <g onClick={() => setSelectedArea("Koramangala")} className="group cursor-pointer">
                              <polygon
                                points="20,110 150,130 140,240 20,240"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Koramangala"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="80"
                                y="185"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Koramangala" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Koramangala
                              </text>
                            </g>

                            {/* Jayanagar (South East) */}
                            <g onClick={() => setSelectedArea("Jayanagar")} className="group cursor-pointer">
                              <polygon
                                points="150,130 300,130 280,240 140,240"
                                className={cn(
                                  "transition-all duration-300 stroke-[1.5px]",
                                  selectedArea === "Jayanagar"
                                    ? "fill-brand-primary/25 stroke-brand-primary animate-pulse"
                                    : "fill-brand-primary/[0.03] stroke-brand-primary/25 hover:fill-brand-primary/10 hover:stroke-brand-primary/60"
                                )}
                              />
                              <text
                                x="215"
                                y="185"
                                className={cn(
                                  "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                  selectedArea === "Jayanagar" ? "fill-brand-primary font-bold" : "fill-ink-dark/70 group-hover:fill-brand-primary"
                                )}
                                textAnchor="middle"
                              >
                                Jayanagar
                              </text>
                            </g>
                          </>
                        )}
                      </g>
                    </svg>
                  </div>
                </div>
              )}

              {/* Area List Grid */}
              <div>
                <h4 className="text-[12px] font-semibold font-outfit text-ink-dark/80 tracking-wide uppercase mb-3 px-1">
                  Neighborhoods in {activeCityTab}
                </h4>

                {filteredAreas.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* All Areas Option */}
                    <button
                      onClick={() => setSelectedArea("")}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer font-figtree text-[14px]",
                        selectedArea === ""
                          ? "bg-brand-primary/5 border-brand-primary text-brand-primary font-semibold font-bold"
                          : "bg-card-white border-border-subtle text-ink-dark hover:border-brand-primary/50 hover:bg-page-bg/30"
                      )}
                    >
                      <span>All Areas</span>
                      {selectedArea === "" && <Check size={16} className="text-brand-primary" />}
                    </button>

                    {filteredAreas.map((area) => {
                      const isSelected = selectedArea === area;
                      return (
                        <button
                          key={area}
                          onClick={() => setSelectedArea(area)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer font-figtree text-[14px]",
                            isSelected
                              ? "bg-brand-primary/5 border-brand-primary text-brand-primary font-semibold font-bold"
                              : "bg-card-white border-border-subtle text-ink-dark hover:border-brand-primary/50 hover:bg-page-bg/30"
                          )}
                        >
                          <span className="truncate">{area}</span>
                          {isSelected && <Check size={16} className="text-brand-primary" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-text-muted font-figtree text-[14px]">
                    No areas found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="p-5 border-t border-border-subtle bg-page-bg/25 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10 backdrop-blur-md">
            <div className="text-[13px] font-figtree text-text-muted text-center sm:text-left">
              Selected: <span className="font-semibold text-ink-dark">{selectedArea || "All Areas"}</span>,{" "}
              <span className="font-semibold text-ink-dark">{activeCityTab}</span>
            </div>
            
            <button
              onClick={() => {
                setSelectedCity(activeCityTab);
                setLocationModalOpen(false);
              }}
              className="w-full sm:w-auto bg-brand-primary text-card-white hover:bg-blue-700 font-figtree font-semibold text-[14px] px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Confirm Selection
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
