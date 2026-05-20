import { create } from "zustand";

export interface LocationState {
  selectedCity: string;
  selectedArea: string;
  selectedAddress: string;
  detectedLocation: { lat: number; lng: number } | null;
  detectedCity: string | null;
  detectedArea: string | null;
  isDetecting: boolean;
  isLocationModalOpen: boolean;
  permissionStatus: "prompt" | "granted" | "denied" | null;
  recentSearches: Array<{ lat: number; lng: number; address: string; city: string; area: string }>;
  setSelectedCity: (city: string) => void;
  setSelectedArea: (area: string) => void;
  setSelectedAddressAndCoords: (address: string, coords: { lat: number; lng: number }, city?: string, area?: string) => void;
  setLocationModalOpen: (open: boolean) => void;
  detectLocation: () => Promise<{ city: string; area: string; address: string; success: boolean }>;
  addRecentSearch: (search: { lat: number; lng: number; address: string; city: string; area: string }) => void;
}

// Keep lists for backward compatibility and popular fallback configurations
export const CITY_CENTER_COORDS: Record<string, { lat: number; lng: number }> = {
  "Vadodara": { lat: 22.3072, lng: 73.1812 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Delhi-NCR": { lat: 28.6139, lng: 77.2090 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
};

export const AREA_COORDS: Record<string, Record<string, { lat: number; lng: number }>> = {
  "Vadodara": {
    "Alkapuri": { lat: 22.3129, lng: 73.1674 },
    "Sayajigunj": { lat: 22.3106, lng: 73.1811 },
    "Fatehgunj": { lat: 22.3214, lng: 73.1866 },
    "Manjalpur": { lat: 22.2748, lng: 73.1979 },
    "Karelibaug": { lat: 22.3274, lng: 73.2081 },
    "Waghodia Rd": { lat: 22.2965, lng: 73.2267 },
    "Raopura": { lat: 22.3025, lng: 73.1925 },
    "Subhanpura": { lat: 22.3242, lng: 73.1594 }
  },
  "Ahmedabad": {
    "Satellite": { lat: 23.0300, lng: 72.5300 },
    "Vastrapur": { lat: 23.0351, lng: 72.5276 },
    "C G Road": { lat: 23.0270, lng: 72.5615 },
    "Bodakdev": { lat: 23.0378, lng: 72.5118 },
    "Ghatlodia": { lat: 23.0645, lng: 72.5401 },
    "Naranpura": { lat: 23.0569, lng: 72.5539 },
    "Navrangpura": { lat: 23.0396, lng: 72.5658 },
    "Prahlad Nagar": { lat: 22.9961, lng: 72.5085 }
  },
  "Mumbai": {
    "Bandra": { lat: 19.0596, lng: 72.8295 },
    "Andheri": { lat: 19.1136, lng: 72.8697 },
    "Colaba": { lat: 18.9067, lng: 72.8147 },
    "Juhu": { lat: 19.1027, lng: 72.8270 },
    "Dadar": { lat: 19.0178, lng: 72.8478 },
    "Powai": { lat: 19.1176, lng: 72.9060 },
    "Worli": { lat: 19.0118, lng: 72.8180 },
    "Borivali": { lat: 19.2294, lng: 72.8573 }
  },
  "Bengaluru": {
    "Indiranagar": { lat: 12.9719, lng: 77.6412 },
    "Koramangala": { lat: 12.9352, lng: 77.6245 },
    "Jayanagar": { lat: 12.9308, lng: 77.5830 },
    "Whitefield": { lat: 12.9698, lng: 77.7499 },
    "HSR Layout": { lat: 12.9121, lng: 77.6446 },
    "Malleshwaram": { lat: 12.9963, lng: 77.5702 },
    "Hebbal": { lat: 13.0354, lng: 77.5988 },
    "Marathahalli": { lat: 12.9569, lng: 77.6967 }
  }
};

const getSavedRecentSearches = (): Array<{ lat: number; lng: number; address: string; city: string; area: string }> => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("shopnear_recent_searches");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getSavedLocation = () => {
  if (typeof window === "undefined") return { city: "Vadodara", area: "", address: "Vadodara, Gujarat, India", coords: CITY_CENTER_COORDS["Vadodara"] };
  try {
    const city = localStorage.getItem("shopnear_selected_city") || "Vadodara";
    const area = localStorage.getItem("shopnear_selected_area") || "";
    const address = localStorage.getItem("shopnear_selected_address") || "Vadodara, Gujarat, India";
    const coordsStr = localStorage.getItem("shopnear_selected_coords");
    const coords = coordsStr ? JSON.parse(coordsStr) : (CITY_CENTER_COORDS[city] || CITY_CENTER_COORDS["Vadodara"]);
    return { city, area, address, coords };
  } catch {
    return { city: "Vadodara", area: "", address: "Vadodara, Gujarat, India", coords: CITY_CENTER_COORDS["Vadodara"] };
  }
};

const initialLoc = getSavedLocation();

export const useLocationStore = create<LocationState>((set, get) => ({
  selectedCity: initialLoc.city,
  selectedArea: initialLoc.area,
  selectedAddress: initialLoc.address,
  detectedLocation: initialLoc.coords,
  detectedCity: initialLoc.city,
  detectedArea: initialLoc.area,
  isDetecting: false,
  isLocationModalOpen: false,
  permissionStatus: null,
  recentSearches: getSavedRecentSearches(),

  setSelectedCity: (city: string) => {
    const coords = CITY_CENTER_COORDS[city];
    const newAddress = `${city}, India`;
    if (typeof window !== "undefined") {
      localStorage.setItem("shopnear_selected_city", city);
      localStorage.setItem("shopnear_selected_area", "");
      localStorage.setItem("shopnear_selected_address", newAddress);
      if (coords) {
        localStorage.setItem("shopnear_selected_coords", JSON.stringify(coords));
      }
    }
    set({
      selectedCity: city,
      selectedArea: "",
      selectedAddress: newAddress,
      detectedLocation: coords || null,
      detectedCity: city,
      detectedArea: ""
    });
  },

  setSelectedArea: (area: string) => {
    const city = get().selectedCity;
    const areaCoords = AREA_COORDS[city]?.[area];
    const newAddress = area ? `${area}, ${city}, India` : `${city}, India`;
    if (typeof window !== "undefined") {
      localStorage.setItem("shopnear_selected_area", area);
      localStorage.setItem("shopnear_selected_address", newAddress);
      if (areaCoords) {
        localStorage.setItem("shopnear_selected_coords", JSON.stringify(areaCoords));
      }
    }
    set({
      selectedArea: area,
      selectedAddress: newAddress,
      detectedLocation: areaCoords || get().detectedLocation,
      detectedArea: area
    });
  },

  setSelectedAddressAndCoords: (address: string, coords: { lat: number; lng: number }, city?: string, area?: string) => {
    // Extract city and area from address if not provided
    let extractedCity = city || "";
    let extractedArea = area || "";

    if (!extractedCity || !extractedArea) {
      const parts = address.split(",").map(p => p.trim());
      // A simple heuristic for Nominatim addresses: "GIFT City, Gandhinagar, Gujarat, 382355, India"
      // Let's make sure we find a reasonable neighborhood/city
      if (parts.length >= 3) {
        extractedArea = parts[0];
        extractedCity = parts[1];
      } else if (parts.length === 2) {
        extractedCity = parts[0];
      } else {
        extractedCity = address;
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("shopnear_selected_city", extractedCity);
      localStorage.setItem("shopnear_selected_area", extractedArea);
      localStorage.setItem("shopnear_selected_address", address);
      localStorage.setItem("shopnear_selected_coords", JSON.stringify(coords));
    }

    const searchObj = { lat: coords.lat, lng: coords.lng, address, city: extractedCity, area: extractedArea };
    get().addRecentSearch(searchObj);

    set({
      selectedCity: extractedCity,
      selectedArea: extractedArea,
      selectedAddress: address,
      detectedLocation: coords,
      detectedCity: extractedCity,
      detectedArea: extractedArea
    });
  },

  setLocationModalOpen: (open: boolean) => {
    set({ isLocationModalOpen: open });
  },

  addRecentSearch: (search) => {
    const current = get().recentSearches;
    // Deduplicate
    const filtered = current.filter(item => item.address !== search.address);
    const updated = [search, ...filtered].slice(0, 5); // keep last 5
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shopnear_recent_searches", JSON.stringify(updated));
      } catch {}
    }
    set({ recentSearches: updated });
  },

  detectLocation: async () => {
    set({ isDetecting: true });

    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        set({ isDetecting: false, permissionStatus: "denied" });
        resolve({ city: get().selectedCity, area: get().selectedArea, address: get().selectedAddress, success: false });
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

          let city = "Unknown";
          let area = "";
          let address = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          try {
            // Nominatim reverse geocoding (always works, highly accurate)
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              address = data.display_name || address;
              const addr = data.address || {};
              city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "Unknown";
              area = addr.suburb || addr.neighbourhood || addr.city_district || addr.road || "";
            }
          } catch (err) {
            console.error("Nominatim Reverse Geocoding Error:", err);
          }

          if (typeof window !== "undefined") {
            localStorage.setItem("shopnear_selected_city", city);
            localStorage.setItem("shopnear_selected_area", area);
            localStorage.setItem("shopnear_selected_address", address);
            localStorage.setItem("shopnear_selected_coords", JSON.stringify({ lat, lng }));
          }

          set({
            selectedCity: city,
            selectedArea: area,
            selectedAddress: address,
            detectedCity: city,
            detectedArea: area,
            isDetecting: false
          });

          // Add to recent search
          get().addRecentSearch({ lat, lng, address, city, area });

          resolve({ city, area, address, success: true });
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
          resolve({ city: get().selectedCity, area: get().selectedArea, address: get().selectedAddress, success: false });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }
}));
