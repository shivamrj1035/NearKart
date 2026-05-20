"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Navigation, MapPin, Loader2, Clock, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationStore, CITY_CENTER_COORDS } from "@/features/location/store/useLocationStore";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    city_district?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
  };
};

type RecentSearch = {
  lat: number;
  lng: number;
  address: string;
  city: string;
  area: string;
};

const POPULAR_CITIES = [
  "Ahmedabad",
  "Mumbai",
  "Bengaluru",
  "Delhi-NCR",
  "Vadodara",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

export default function LocationModal() {
  const {
    isLocationModalOpen,
    isDetecting,
    recentSearches,
    setSelectedAddressAndCoords,
    setLocationModalOpen,
    detectLocation,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      // Reset modal state when the external open flag changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery("");
      setSuggestions([]);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isLocationModalOpen]);

  // Debounced search for Nominatim autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Clear stale autocomplete results after the query is emptied.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&format=json&addressdetails=1&limit=6`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Filter to format address displays nicely
          setSuggestions(data || []);
        }
      } catch (err) {
        console.error("Nominatim search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleDetectLocation = async () => {
    const res = await detectLocation();
    if (res.success) {
      setLocationModalOpen(false);
    }
  };

  const handleSuggestionSelect = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const address = item.display_name;
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
    const area = addr.suburb || addr.neighbourhood || addr.city_district || addr.road || "";

    setSelectedAddressAndCoords(address, { lat, lng }, city, area);
    setLocationModalOpen(false);
  };

  const handlePopularCitySelect = (city: string) => {
    const coords = CITY_CENTER_COORDS[city];
    if (coords) {
      const address = `${city}, India`;
      setSelectedAddressAndCoords(address, coords, city, "");
      setLocationModalOpen(false);
    }
  };

  const handleRecentSearchSelect = (item: RecentSearch) => {
    setSelectedAddressAndCoords(item.address, { lat: item.lat, lng: item.lng }, item.city, item.area);
    setLocationModalOpen(false);
  };

  if (!isLocationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLocationModalOpen(false)}
          className="fixed inset-0 bg-ink-dark/60 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Card (Swiggy / Zomato style sliding panel) */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-xl bg-card-white rounded-3xl overflow-hidden shadow-2xl border border-border-subtle flex flex-col max-h-[75vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-border-subtle bg-card-white flex items-center justify-between">
            <div className="flex-1 mr-4">
              <h3 className="font-outfit font-black text-lg text-ink-dark">
                Change Location
              </h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Search your area, neighborhood or city to find stores nearby
              </p>
            </div>
            <button
              onClick={() => setLocationModalOpen(false)}
              className="p-2 hover:bg-page-bg rounded-full text-text-muted hover:text-ink-dark transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input and Geolocation Button */}
          <div className="p-5 bg-page-bg/30 border-b border-border-subtle space-y-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-border-subtle bg-card-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-[14px] text-ink-dark outline-none font-figtree transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted hover:bg-page-bg transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Locate Me button */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl font-figtree font-bold text-[13px] border border-brand-primary/20 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-card-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={15} className="animate-spin text-current" />
                  <span>Locating your position...</span>
                </>
              ) : (
                <>
                  <Navigation size={14} className="fill-current" />
                  <span>Use Current Location (GPS)</span>
                </>
              )}
            </button>
          </div>

          {/* Results / Suggestions list */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <Loader2 size={24} className="animate-spin text-brand-primary" />
                <span className="text-[12px] text-text-muted font-medium">Searching addresses...</span>
              </div>
            ) : searchQuery.trim() !== "" ? (
              // Search Suggestions list
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-1 mb-2">
                  Search Results
                </div>
                {suggestions.length > 0 ? (
                  suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionSelect(item)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-border-subtle hover:bg-page-bg/50 text-left transition-all cursor-pointer group"
                    >
                      <MapPin size={16} className="text-text-muted group-hover:text-brand-primary mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-figtree font-semibold text-[13px] text-ink-dark truncate group-hover:text-brand-primary">
                          {item.address?.suburb || item.address?.neighbourhood || item.address?.city_district || item.address?.road || item.display_name.split(",")[0]}
                        </div>
                        <div className="font-figtree text-[11px] text-text-muted truncate mt-0.5">
                          {item.display_name}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-10 text-[13px] text-text-muted">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            ) : (
              // Default view: Recent Searches + Popular Cities
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-1 mb-2">
                      Recent Searches
                    </div>
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentSearchSelect(item)}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-border-subtle hover:bg-page-bg/50 text-left transition-all cursor-pointer group"
                      >
                        <Clock size={15} className="text-text-muted group-hover:text-brand-primary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-figtree font-semibold text-[13px] text-ink-dark truncate group-hover:text-brand-primary">
                            {item.area || item.city}
                          </div>
                          <div className="font-figtree text-[11px] text-text-muted truncate mt-0.5">
                            {item.address}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Cities */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-1">
                    Popular Cities
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => handlePopularCitySelect(city)}
                        className="flex items-center gap-1.5 p-3 rounded-xl border border-border-subtle bg-card-white hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-center justify-center font-figtree font-medium text-[12px] text-ink-dark cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        <Map size={12} className="text-text-muted shrink-0" />
                        <span className="truncate">{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
