import { create } from "zustand";

export interface LocationState {
  selectedCity: string;
  selectedArea: string;
  detectedLocation: { lat: number; lng: number } | null;
  detectedCity: string | null;
  detectedArea: string | null;
  isDetecting: boolean;
  isLocationModalOpen: boolean;
  permissionStatus: "prompt" | "granted" | "denied" | null;
  setSelectedCity: (city: string) => void;
  setSelectedArea: (area: string) => void;
  setLocationModalOpen: (open: boolean) => void;
  detectLocation: () => Promise<{ city: string; area: string; success: boolean }>;
}

// Coordinate bounding boxes for local approximation
const CITY_COORDS = [
  {
    city: "Vadodara",
    latMin: 22.1, latMax: 22.5,
    lngMin: 73.0, lngMax: 73.4,
    areas: ["Alkapuri", "Sayajigunj", "Fatehgunj", "Manjalpur", "Karelibaug", "Waghodia Rd", "Raopura", "Subhanpura"]
  },
  {
    city: "Ahmedabad",
    latMin: 22.8, latMax: 23.2,
    lngMin: 72.4, lngMax: 72.8,
    areas: ["Satellite", "Vastrapur", "C G Road", "Bodakdev"]
  },
  {
    city: "Mumbai",
    latMin: 18.8, latMax: 19.3,
    lngMin: 72.7, lngMax: 73.1,
    areas: ["Bandra", "Andheri", "Colaba", "Juhu"]
  },
  {
    city: "Bengaluru",
    latMin: 12.8, latMax: 13.2,
    lngMin: 77.4, lngMax: 77.8,
    areas: ["Indiranagar", "Koramangala", "Jayanagar", "Whitefield"]
  }
];

export const useLocationStore = create<LocationState>((set, get) => ({
  selectedCity: "Vadodara",
  selectedArea: "",
  detectedLocation: null,
  detectedCity: null,
  detectedArea: null,
  isDetecting: false,
  isLocationModalOpen: false,
  permissionStatus: null,

  setSelectedCity: (city: string) => {
    set({ selectedCity: city, selectedArea: "" });
  },

  setSelectedArea: (area: string) => {
    set({ selectedArea: area });
  },

  setLocationModalOpen: (open: boolean) => {
    set({ isLocationModalOpen: open });
  },

  detectLocation: async () => {
    set({ isDetecting: true });
    
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        set({ isDetecting: false, permissionStatus: "denied" });
        resolve({ city: "Vadodara", area: "", success: false });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          set({ 
            detectedLocation: { lat, lng }, 
            permissionStatus: "granted" 
          });

          let city = "Vadodara";
          let area = "";

          // 1. Try mapping using predefined local coordinate boxes first
          const matched = CITY_COORDS.find(
            (c) => lat >= c.latMin && lat <= c.latMax && lng >= c.lngMin && lng <= c.lngMax
          );

          if (matched) {
            city = matched.city;
            // Pick a random/first area for mock match or let user choose
            area = matched.areas[Math.floor(Math.random() * matched.areas.length)];
          } else {
            // 2. Try Geocode.maps.co API reverse geocoding
            try {
              const apiKey = process.env.NEXT_PUBLIC_GEOCODE_API_KEY || "";
              const url = apiKey 
                ? `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${apiKey}`
                : `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`;

              const res = await fetch(url, { headers: { "User-Agent": "ShopNear-App" } });
              if (res.ok) {
                const data = await res.json();
                const addr = data.address || {};
                const detectedCityName = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
                const detectedSub = addr.suburb || addr.neighbourhood || addr.city_district || "";
                
                if (detectedCityName) {
                  // Normalize city name
                  const matchedCity = CITY_COORDS.find(
                    (c) => c.city.toLowerCase() === detectedCityName.toLowerCase()
                  );
                  if (matchedCity) {
                    city = matchedCity.city;
                    // See if suburb matches any of our areas
                    const matchedArea = matchedCity.areas.find(
                      (a) => a.toLowerCase() === detectedSub.toLowerCase() || detectedSub.toLowerCase().includes(a.toLowerCase())
                    );
                    area = matchedArea || matchedCity.areas[0];
                  } else {
                    // It's a city we don't have shops for yet
                    city = detectedCityName;
                    area = detectedSub || "";
                  }
                }
              }
            } catch (err) {
              console.error("Geocode.maps.co Reverse Geocoding Error:", err);
            }
          }

          set({
            detectedCity: city,
            detectedArea: area,
            isDetecting: false
          });

          resolve({ city, area, success: true });
        },
        (error) => {
          console.error("Geolocation Error:", { code: error.code, message: error.message });
          let status: "denied" | "prompt" = "prompt";
          if (error.code === error.PERMISSION_DENIED) {
            status = "denied";
          }
          set({ 
            isDetecting: false, 
            permissionStatus: status 
          });
          resolve({ city: "Vadodara", area: "", success: false });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }
}));
