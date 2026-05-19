"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Navigation, Check, Loader2, MapPin, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationStore } from "@/store/useLocationStore";
import { cn } from "@/lib/utils";

// 10 Popular Cities matching BookMyShow
const POPULAR_CITIES = [
  "Mumbai",
  "Delhi-NCR",
  "Bengaluru",
  "Hyderabad",
  "Chandigarh",
  "Ahmedabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Kochi"
];

// Other cities alphabetical list
const OTHER_CITIES = [
  "Vadodara", "Agra", "Ajmer", "Alappuzha", "Amritsar", "Aurangabad", 
  "Bhopal", "Bhubaneswar", "Coimbatore", "Dehradun", "Goa", "Indore", 
  "Jaipur", "Jalandhar", "Jodhpur", "Kanpur", "Kota", "Lucknow", 
  "Ludhiana", "Madurai", "Mangaluru", "Mysuru", "Nagpur", "Nashik", 
  "Patna", "Puducherry", "Raipur", "Rajkot", "Ranchi", "Surat", 
  "Thiruvananthapuram", "Tiruchirappalli", "Udaipur", "Vijayawada", "Visakhapatnam"
];

// Cities with interactive maps
const INTERACTIVE_MAP_CITIES = ["Vadodara", "Ahmedabad", "Mumbai", "Bengaluru"];

// Areas by city corresponding to useLocationStore AREA_COORDS
const AREAS_BY_CITY: Record<string, string[]> = {
  "Vadodara": ["Alkapuri", "Sayajigunj", "Fatehgunj", "Manjalpur", "Karelibaug", "Waghodia Rd", "Raopura", "Subhanpura"],
  "Ahmedabad": ["Satellite", "Vastrapur", "C G Road", "Bodakdev", "Ghatlodia", "Naranpura", "Navrangpura", "Prahlad Nagar"],
  "Mumbai": ["Bandra", "Andheri", "Colaba", "Juhu", "Dadar", "Powai", "Worli", "Borivali"],
  "Bengaluru": ["Indiranagar", "Koramangala", "Jayanagar", "Whitefield", "HSR Layout", "Malleshwaram", "Hebbal", "Marathahalli"],
  "Delhi-NCR": ["Connaught Place", "Saket", "Rajouri Garden", "Noida Sector 62", "Gurugram Phase 3", "Vasant Kunj", "Dwarka", "Karol Bagh"],
  "Hyderabad": ["Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur", "Secunderabad", "Kukatpally", "Begumpet", "Kondapur"],
  "Chandigarh": ["Sector 17", "Sector 35", "Sector 22", "Sector 8", "Elante Mall Area", "Panchkula", "Mohali"],
  "Pune": ["Koregaon Park", "Kothrud", "Viman Nagar", "Hinjawadi", "Baner", "Shivajinagar", "Camp", "Aundh"],
  "Chennai": ["Adyar", "T Nagar", "Velachery", "Nungambakkam", "Mylapore", "Anna Nagar", "Besant Nagar", "OMR"],
  "Kolkata": ["Salt Lake", "Park Street", "New Town", "Ballygunge", "Gariahat", "Tollygunge", "Alipore", "Dum Dum"],
  "Kochi": ["Edappally", "Fort Kochi", "Kakkanad", "Panampilly Nagar", "Vytila", "Marine Drive", "Kadavanthra", "Thrippunithura"]
};

// Hand-drawn custom vector line illustrations for landmarks
const CITY_ICONS: Record<string, React.ReactNode> = {
  "Mumbai": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 20 65 L 60 65 L 60 40 L 55 40 L 55 25 L 25 25 L 25 40 L 20 40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 32 65 L 32 45 C 32 38 48 38 48 45 L 48 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 28 25 L 28 15 C 28 15 32 12 40 12 C 48 12 52 15 52 15 L 52 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="20" r="2" fill="currentColor" />
    </svg>
  ),
  "Delhi-NCR": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 25 65 L 55 65 M 30 65 L 30 25 L 35 22 L 45 22 L 50 25 L 50 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 35 65 L 35 48 C 35 42 45 42 45 48 L 45 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 28 25 L 52 25 M 32 20 L 48 20 M 36 15 L 44 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "Bengaluru": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 15 65 L 65 65 L 65 50 L 15 50 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 25 50 L 25 35 L 55 35 L 55 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 32 35 C 32 20 48 20 48 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 40 20 L 40 10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 30 50 L 30 35 M 36 50 L 36 35 M 44 50 L 44 35 M 50 50 L 50 35" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Hyderabad": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 25 65 L 55 65 L 52 40 L 28 40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 33 65 L 33 52 C 33 46 47 46 47 52 L 47 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 22 65 L 22 25 C 22 23 28 23 28 25 L 28 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 58 65 L 58 25 C 58 23 52 23 52 25 L 52 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 20 25 C 20 20 30 20 30 25 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 50 25 C 50 20 60 20 60 25 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 20 40 L 60 40" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  "Chandigarh": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 40 65 L 40 45 C 38 45 36 43 36 40 C 36 32 25 35 25 28 C 25 24 28 22 31 24 C 33 25 35 27 35 30 L 37 30 C 37 22 39 12 43 12 C 46 12 47 18 47 25 L 49 25 C 49 18 51 15 54 15 C 57 15 57 20 57 28 C 57 32 54 36 51 38 L 51 45 C 51 45 40 45 40 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 30 65 L 50 65 M 35 65 L 35 72 L 45 72 L 45 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Ahmedabad": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 15 65 L 15 35 C 15 35 20 30 27 35 L 27 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 27 65 L 27 28 C 27 28 35 20 43 28 L 43 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 43 65 L 43 35 C 43 35 50 30 55 35 L 55 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 10 65 L 60 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 12 30 L 58 30" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 12 25 L 58 25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Pune": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 15 65 L 25 65 L 25 35 L 15 30 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 55 65 L 65 65 L 65 30 L 55 35 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 25 65 L 55 65 L 55 40 L 25 40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 34 65 L 34 50 C 34 45 46 45 46 50 L 46 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="55" r="1" fill="currentColor" />
      <circle cx="44" cy="55" r="1" fill="currentColor" />
      <circle cx="36" cy="60" r="1" fill="currentColor" />
      <circle cx="44" cy="60" r="1" fill="currentColor" />
    </svg>
  ),
  "Chennai": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 20 65 L 60 65 L 55 52 L 25 52 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 25 52 L 55 52 L 50 40 L 30 40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 30 40 L 50 40 L 46 28 L 34 28 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 34 28 L 46 28 L 42 16 L 38 16 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 36 16 C 36 12 44 12 44 16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 36 65 L 36 58 C 36 56 44 56 44 58 L 44 65" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Kolkata": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 20 65 L 20 25 L 25 25 L 25 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 55 65 L 55 25 L 60 25 L 60 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 10 55 L 70 55" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 20 28 C 30 38 50 38 55 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 10 40 L 20 28 M 60 28 L 70 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 30 34 L 30 55 M 40 36 L 40 55 M 50 34 L 50 55" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  "Kochi": (
    <svg viewBox="0 0 80 80" className="w-12 h-12 transition-all duration-300">
      <path d="M 15 65 L 45 40 L 65 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 45 40 L 50 65" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 45 40 C 48 30 58 30 65 35 C 70 40 68 50 65 55" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 10 65 L 70 65 M 15 70 L 65 70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
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

  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCityTab, setActiveCityTab] = useState(selectedCity);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showDetectionBanner, setShowDetectionBanner] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      setStep(1);
      setActiveCityTab(selectedCity);
      setSearchQuery("");
      setShowAllCities(false);
      setShowDetectionBanner(false);
    }
  }, [isLocationModalOpen, selectedCity]);

  // Handle location detection
  const handleDetectLocation = async () => {
    const result = await detectLocation();
    if (result.success) {
      setActiveCityTab(result.city);
      if (result.area) {
        setSelectedArea(result.area);
      }
      setSelectedCity(result.city);
      setStep(2);
      setShowDetectionBanner(true);
      setTimeout(() => setShowDetectionBanner(false), 4000);
    }
  };

  // Switch to city and transition to neighborhood selection
  const handleCitySelect = (city: string) => {
    setActiveCityTab(city);
    setStep(2);
    setSearchQuery("");
  };

  // Confirm and close
  const handleAreaSelect = (area: string) => {
    setSelectedCity(activeCityTab);
    setSelectedArea(area);
    setLocationModalOpen(false);
  };

  // Back to city selection
  const handleBackToCities = () => {
    setStep(1);
    setSearchQuery("");
  };

  // Group other cities alphabetically
  const alphabeticalOtherCities = useMemo(() => {
    const groups: Record<string, string[]> = {};
    OTHER_CITIES.forEach(city => {
      const letter = city.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(city);
    });
    const sortedLetters = Object.keys(groups).sort();
    sortedLetters.forEach(letter => {
      groups[letter].sort();
    });
    return { letters: sortedLetters, groups };
  }, []);

  // Filter cities for search in Step 1
  const matchingCities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const all = [...POPULAR_CITIES, ...OTHER_CITIES];
    const unique = Array.from(new Set(all));
    return unique.filter(c => c.toLowerCase().includes(query));
  }, [searchQuery]);

  // Filter areas in Step 2
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

        {/* Modal Content Card (Widescreen) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-4xl bg-card-white rounded-3xl overflow-hidden shadow-2xl border border-border-subtle flex flex-col max-h-[85vh] md:max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex flex-col bg-card-white sticky top-0 z-10 gap-4">
            <div className="flex items-center justify-between">
              <div>
                {step === 2 && (
                  <button
                    onClick={handleBackToCities}
                    className="flex items-center gap-1 text-[#F84464] hover:underline font-figtree font-semibold text-[13px] mb-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Change City</span>
                  </button>
                )}
                <h3 className="font-outfit font-bold text-xl text-ink-dark flex items-center gap-2">
                  <MapPin size={22} className="text-[#F84464]" />
                  {step === 1 ? "Select City" : `Select Neighborhood in ${activeCityTab}`}
                </h3>
                <p className="text-[12px] text-text-muted mt-0.5">
                  {step === 1 
                    ? "Choose your city to discover local shops and real-world availability." 
                    : `Choose your area in ${activeCityTab} or view all nearby shops.`}
                </p>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-2 hover:bg-page-bg rounded-full text-text-muted hover:text-ink-dark transition-colors cursor-pointer self-start"
              >
                <X size={20} />
              </button>
            </div>

            {/* Geolocation & Search block */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Area search box */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder={step === 1 ? "Search for your city..." : `Search areas in ${activeCityTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl border border-border-subtle bg-page-bg/50 focus:bg-card-white focus:border-[#F84464] focus:ring-2 focus:ring-[#F84464]/10 text-[14px] text-ink-dark outline-none font-figtree transition-all"
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

              {/* Geolocation Button */}
              {step === 1 && (
                <button
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className={cn(
                    "flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-figtree font-semibold text-[14px] transition-all duration-200 shrink-0 border cursor-pointer",
                    isDetecting
                      ? "bg-page-bg text-text-muted border-border-subtle cursor-not-allowed"
                      : "bg-[#F84464]/5 text-[#F84464] border-[#F84464]/20 hover:bg-[#F84464] hover:text-card-white hover:border-[#F84464] hover:shadow-md"
                  )}
                >
                  {isDetecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-[#F84464]" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={16} className="fill-current" />
                      <span>Detect my location</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Body Section (Scrollable) */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            {/* Step 1: City Selection */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Search Results */}
                {searchQuery.trim() !== "" ? (
                  <div>
                    <h4 className="font-outfit font-semibold text-lg text-ink-dark mb-4">Search Results</h4>
                    {matchingCities.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {matchingCities.map(city => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border-subtle bg-card-white hover:border-[#F84464] hover:bg-[#F84464]/5 text-left transition-all cursor-pointer font-figtree text-[14px] text-ink-dark group"
                          >
                            <MapPin size={15} className="text-text-muted group-hover:text-[#F84464]" />
                            <span className="font-medium group-hover:text-[#F84464]">{city}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-text-muted font-figtree text-[14px]">
                        No cities found matching &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Popular Cities Grid */}
                    <div>
                      <h4 className="font-outfit font-semibold text-lg text-ink-dark mb-5">Popular Cities</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {POPULAR_CITIES.map(city => {
                          const isSelected = selectedCity === city;
                          return (
                            <button
                              key={city}
                              onClick={() => handleCitySelect(city)}
                              className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-page-bg/40 transition-all group cursor-pointer border border-transparent hover:border-border-subtle"
                            >
                              <div className={cn(
                                "w-18 h-18 rounded-full flex items-center justify-center border border-border-subtle bg-page-bg/20 text-text-muted group-hover:border-[#F84464]/40 group-hover:bg-[#F84464]/5 group-hover:text-[#F84464] transition-all duration-300",
                                isSelected && "border-[#F84464] bg-[#F84464]/5 text-[#F84464]"
                              )}>
                                {CITY_ICONS[city]}
                              </div>
                              <span className={cn(
                                "font-figtree font-medium text-[13px] text-ink-dark transition-colors duration-200 group-hover:text-[#F84464] text-center",
                                isSelected && "text-[#F84464] font-bold"
                              )}>
                                {city}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Other Cities */}
                    <div className="border-t border-border-subtle/70 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-outfit font-semibold text-lg text-ink-dark">Other Cities</h4>
                        <button
                          onClick={() => setShowAllCities(!showAllCities)}
                          className="text-[#F84464] hover:underline font-figtree font-semibold text-[14px] cursor-pointer"
                        >
                          {showAllCities ? "Hide all cities" : "Show all cities"}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showAllCities && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-6 mt-4">
                              {alphabeticalOtherCities.letters.map(letter => (
                                <div key={letter} className="flex flex-col sm:flex-row gap-2 border-b border-border-subtle/50 pb-4 last:border-b-0">
                                  <div className="font-outfit font-bold text-lg text-[#F84464] w-12 shrink-0">{letter}</div>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 flex-1">
                                    {alphabeticalOtherCities.groups[letter].map(city => {
                                      const isSelected = selectedCity === city;
                                      return (
                                        <button
                                          key={city}
                                          onClick={() => handleCitySelect(city)}
                                          className={cn(
                                            "text-left font-figtree text-[14px] hover:text-[#F84464] transition-colors py-1 cursor-pointer",
                                            isSelected ? "text-[#F84464] font-semibold" : "text-text-muted"
                                          )}
                                        >
                                          {city}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Neighborhood Selection */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Detection status banner */}
                <AnimatePresence>
                  {showDetectionBanner && detectedCity === activeCityTab && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-[#F84464]/5 border border-[#F84464]/20 rounded-2xl p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <Navigation size={18} className="text-[#F84464] animate-pulse shrink-0" />
                        <div className="text-[13px] font-medium text-ink-dark">
                          We detected your location as <span className="font-semibold text-[#F84464]">{detectedArea ? `${detectedArea}, ` : ""}{detectedCity}</span>.
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (detectedArea) setSelectedArea(detectedArea);
                          setShowDetectionBanner(false);
                        }}
                        className="bg-[#F84464] text-card-white text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-rose-600 transition-colors shadow-sm shrink-0 cursor-pointer"
                      >
                        Use this
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Map & Grid Content */}
                <div className="space-y-4">
                  {/* Interactive SVG Neighborhood Map */}
                  {!searchQuery && INTERACTIVE_MAP_CITIES.includes(activeCityTab) && (
                    <div className="bg-page-bg/40 border border-border-subtle rounded-3xl p-4 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between mb-3 px-2">
                        <span className="text-[11px] font-bold font-outfit text-ink-dark/80 tracking-wide uppercase">
                          Interactive Map: {activeCityTab}
                        </span>
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#F84464] inline-block" /> Click to Select Area
                        </span>
                      </div>

                      <div className="relative w-full aspect-[320/260] max-w-md bg-card-white border border-border-subtle/60 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                        {/* SVG Map Grid Background */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#F84464_1px,transparent_1px)] [background-size:16px_16px]" />

                        {/* SVG drawing */}
                        <svg viewBox="0 0 320 260" className="w-full h-full select-none">
                          <g>
                            {/* Vadodara Map */}
                            {activeCityTab === "Vadodara" && (
                              <>
                                {/* Fatehgunj (North) */}
                                <g onClick={() => handleAreaSelect("Fatehgunj")} className="group cursor-pointer">
                                  <polygon
                                    points="110,20 210,20 190,80 120,80"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Fatehgunj" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="157"
                                    y="52"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Fatehgunj" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Fatehgunj
                                  </text>
                                </g>

                                {/* Karelibaug (North East) */}
                                <g onClick={() => handleAreaSelect("Karelibaug")} className="group cursor-pointer">
                                  <polygon
                                    points="210,20 300,30 290,90 190,80"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Karelibaug" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="245"
                                    y="58"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Karelibaug" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Karelibaug
                                  </text>
                                </g>

                                {/* Subhanpura (West) */}
                                <g onClick={() => handleAreaSelect("Subhanpura")} className="group cursor-pointer">
                                  <polygon
                                    points="15,90 100,95 90,155 10,145"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Subhanpura" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="53"
                                    y="125"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Subhanpura" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Subhanpura
                                  </text>
                                </g>

                                {/* Alkapuri (Central-West) */}
                                <g onClick={() => handleAreaSelect("Alkapuri")} className="group cursor-pointer">
                                  <polygon
                                    points="100,95 170,95 170,155 90,155"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Alkapuri" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="130"
                                    y="128"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Alkapuri" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Alkapuri
                                  </text>
                                </g>

                                {/* Sayajigunj (Central) */}
                                <g onClick={() => handleAreaSelect("Sayajigunj")} className="group cursor-pointer">
                                  <polygon
                                    points="170,95 230,95 220,155 170,155"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Sayajigunj" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="196"
                                    y="128"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Sayajigunj" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Sayajigunj
                                  </text>
                                </g>

                                {/* Raopura (Central-East) */}
                                <g onClick={() => handleAreaSelect("Raopura")} className="group cursor-pointer">
                                  <polygon
                                    points="230,95 305,100 295,160 220,155"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Raopura" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="262"
                                    y="132"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Raopura" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Raopura
                                  </text>
                                </g>

                                {/* Manjalpur (South) */}
                                <g onClick={() => handleAreaSelect("Manjalpur")} className="group cursor-pointer">
                                  <polygon
                                    points="90,155 180,155 170,235 60,225"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Manjalpur" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="122"
                                    y="198"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Manjalpur" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Manjalpur
                                  </text>
                                </g>

                                {/* Waghodia Road (South-East) */}
                                <g onClick={() => handleAreaSelect("Waghodia Rd")} className="group cursor-pointer">
                                  <polygon
                                    points="180,155 295,160 280,240 170,235"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Waghodia Rd" && selectedCity === "Vadodara"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="230"
                                    y="200"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Waghodia Rd" && selectedCity === "Vadodara" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
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
                                <g onClick={() => handleAreaSelect("Vastrapur")} className="group cursor-pointer">
                                  <polygon
                                    points="20,20 160,20 150,130 20,110"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Vastrapur" && selectedCity === "Ahmedabad"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="85"
                                    y="75"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Vastrapur" && selectedCity === "Ahmedabad" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Vastrapur
                                  </text>
                                </g>

                                {/* Bodakdev (North East) */}
                                <g onClick={() => handleAreaSelect("Bodakdev")} className="group cursor-pointer">
                                  <polygon
                                    points="160,20 300,20 300,130 150,130"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Bodakdev" && selectedCity === "Ahmedabad"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="225"
                                    y="75"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Bodakdev" && selectedCity === "Ahmedabad" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Bodakdev
                                  </text>
                                </g>

                                {/* Satellite (South West) */}
                                <g onClick={() => handleAreaSelect("Satellite")} className="group cursor-pointer">
                                  <polygon
                                    points="20,110 150,130 140,240 20,240"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Satellite" && selectedCity === "Ahmedabad"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="80"
                                    y="185"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Satellite" && selectedCity === "Ahmedabad" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Satellite
                                  </text>
                                </g>

                                {/* C G Road (South East) */}
                                <g onClick={() => handleAreaSelect("C G Road")} className="group cursor-pointer">
                                  <polygon
                                    points="150,130 300,130 280,240 140,240"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "C G Road" && selectedCity === "Ahmedabad"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="215"
                                    y="185"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "C G Road" && selectedCity === "Ahmedabad" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
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
                                <g onClick={() => handleAreaSelect("Andheri")} className="group cursor-pointer">
                                  <polygon
                                    points="160,20 300,20 280,120 160,100"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Andheri" && selectedCity === "Mumbai"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="225"
                                    y="65"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Andheri" && selectedCity === "Mumbai" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Andheri
                                  </text>
                                </g>

                                {/* Bandra (North West) */}
                                <g onClick={() => handleAreaSelect("Bandra")} className="group cursor-pointer">
                                  <polygon
                                    points="20,20 160,20 160,100 80,140"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Bandra" && selectedCity === "Mumbai"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="95"
                                    y="70"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Bandra" && selectedCity === "Mumbai" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Bandra
                                  </text>
                                </g>

                                {/* Juhu (South East) */}
                                <g onClick={() => handleAreaSelect("Juhu")} className="group cursor-pointer">
                                  <polygon
                                    points="160,100 280,120 250,240 150,200"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Juhu" && selectedCity === "Mumbai"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="210"
                                    y="165"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Juhu" && selectedCity === "Mumbai" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Juhu
                                  </text>
                                </g>

                                {/* Colaba (South West) */}
                                <g onClick={() => handleAreaSelect("Colaba")} className="group cursor-pointer">
                                  <polygon
                                    points="80,140 160,100 150,200 40,240"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Colaba" && selectedCity === "Mumbai"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="100"
                                    y="175"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Colaba" && selectedCity === "Mumbai" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
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
                                <g onClick={() => handleAreaSelect("Indiranagar")} className="group cursor-pointer">
                                  <polygon
                                    points="20,20 160,20 150,130 20,110"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Indiranagar" && selectedCity === "Bengaluru"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="85"
                                    y="75"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Indiranagar" && selectedCity === "Bengaluru" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Indiranagar
                                  </text>
                                </g>

                                {/* Whitefield (North East) */}
                                <g onClick={() => handleAreaSelect("Whitefield")} className="group cursor-pointer">
                                  <polygon
                                    points="160,20 300,20 300,130 150,130"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Whitefield" && selectedCity === "Bengaluru"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="225"
                                    y="75"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Whitefield" && selectedCity === "Bengaluru" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Whitefield
                                  </text>
                                </g>

                                {/* Koramangala (South West) */}
                                <g onClick={() => handleAreaSelect("Koramangala")} className="group cursor-pointer">
                                  <polygon
                                    points="20,110 150,130 140,240 20,240"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Koramangala" && selectedCity === "Bengaluru"
                                        ? "fill-[#F84464]/25 stroke-[#F84464] animate-pulse"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="80"
                                    y="185"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Koramangala" && selectedCity === "Bengaluru" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
                                    )}
                                    textAnchor="middle"
                                  >
                                    Koramangala
                                  </text>
                                </g>

                                {/* Jayanagar (South East) */}
                                <g onClick={() => handleAreaSelect("Jayanagar")} className="group cursor-pointer">
                                  <polygon
                                    points="150,130 300,130 280,240 140,240"
                                    className={cn(
                                      "transition-all duration-300 stroke-[1.5px]",
                                      selectedArea === "Jayanagar" && selectedCity === "Bengaluru"
                                        ? "fill-[#F84464]/25 stroke-[#F84464]"
                                        : "fill-[#F84464]/[0.03] stroke-[#F84464]/25 hover:fill-[#F84464]/10 hover:stroke-[#F84464]/60"
                                    )}
                                  />
                                  <text
                                    x="215"
                                    y="185"
                                    className={cn(
                                      "font-outfit text-[11px] font-semibold pointer-events-none transition-colors duration-200",
                                      selectedArea === "Jayanagar" && selectedCity === "Bengaluru" ? "fill-[#F84464] font-bold" : "fill-ink-dark/70 group-hover:fill-[#F84464]"
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* All Areas Option */}
                      <button
                        onClick={() => handleAreaSelect("")}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer font-figtree text-[14px]",
                          selectedArea === "" && selectedCity === activeCityTab
                            ? "bg-[#F84464]/5 border-[#F84464] text-[#F84464] font-bold"
                            : "bg-card-white border-border-subtle text-ink-dark hover:border-[#F84464]/50 hover:bg-[#F84464]/5"
                        )}
                      >
                        <span>All Areas</span>
                        {selectedArea === "" && selectedCity === activeCityTab && <Check size={16} className="text-[#F84464]" />}
                      </button>

                      {filteredAreas.length > 0 ? (
                        filteredAreas.map((area) => {
                          const isSelected = selectedArea === area && selectedCity === activeCityTab;
                          return (
                            <button
                              key={area}
                              onClick={() => handleAreaSelect(area)}
                              className={cn(
                                "flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer font-figtree text-[14px]",
                                isSelected
                                  ? "bg-[#F84464]/5 border-[#F84464] text-[#F84464] font-bold"
                                  : "bg-card-white border-border-subtle text-ink-dark hover:border-[#F84464]/50 hover:bg-[#F84464]/5"
                              )}
                            >
                              <span className="truncate">{area}</span>
                              {isSelected && <Check size={16} className="text-[#F84464]" />}
                            </button>
                          );
                        })
                      ) : (
                        searchQuery && (
                          <div className="col-span-full text-center py-6 text-text-muted font-figtree text-[14px]">
                            No areas found matching &quot;{searchQuery}&quot;
                          </div>
                        )
                      )}
                    </div>

                    {filteredAreas.length === 0 && !searchQuery && (
                      <div className="text-center py-8 text-text-muted font-figtree text-[14px] bg-page-bg/30 border border-dashed border-border-subtle rounded-2xl p-4">
                        We don't have neighborhood lists for {activeCityTab} yet.
                        <br />
                        Select <span className="font-semibold text-ink-dark">All Areas</span> above to view any shops in this city.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="p-5 border-t border-border-subtle bg-page-bg/25 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10 backdrop-blur-md">
            <div className="text-[13px] font-figtree text-text-muted text-center sm:text-left">
              Currently Selected: <span className="font-semibold text-ink-dark">{selectedArea || "All Areas"}</span>,{" "}
              <span className="font-semibold text-ink-dark">{selectedCity}</span>
            </div>
            
            <button
              onClick={() => {
                setSelectedCity(activeCityTab);
                setLocationModalOpen(false);
              }}
              className="w-full sm:w-auto bg-[#F84464] text-card-white hover:bg-rose-600 font-figtree font-semibold text-[14px] px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Confirm & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
