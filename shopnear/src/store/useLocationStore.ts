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
  },
  "Delhi-NCR": {
    "Connaught Place": { lat: 28.6304, lng: 77.2177 },
    "Saket": { lat: 28.5244, lng: 77.2066 },
    "Rajouri Garden": { lat: 28.6415, lng: 77.1215 },
    "Noida Sector 62": { lat: 28.6225, lng: 77.3639 },
    "Gurugram Phase 3": { lat: 28.4893, lng: 77.0898 },
    "Vasant Kunj": { lat: 28.5387, lng: 77.1557 },
    "Dwarka": { lat: 28.5859, lng: 77.0505 },
    "Karol Bagh": { lat: 28.6507, lng: 77.1898 }
  },
  "Hyderabad": {
    "Gachibowli": { lat: 17.4401, lng: 78.3489 },
    "Jubilee Hills": { lat: 17.4316, lng: 78.4088 },
    "Banjara Hills": { lat: 17.4176, lng: 78.4350 },
    "Madhapur": { lat: 17.4483, lng: 78.3741 },
    "Secunderabad": { lat: 17.4399, lng: 78.4983 },
    "Kukatpally": { lat: 17.4875, lng: 78.3953 },
    "Begumpet": { lat: 17.4447, lng: 78.4664 },
    "Kondapur": { lat: 17.4622, lng: 78.3568 }
  },
  "Chandigarh": {
    "Sector 17": { lat: 30.7421, lng: 76.7875 },
    "Sector 35": { lat: 30.7234, lng: 76.7628 },
    "Sector 22": { lat: 30.7325, lng: 76.7725 },
    "Sector 8": { lat: 30.7512, lng: 76.7885 },
    "Elante Mall Area": { lat: 30.7061, lng: 76.8013 },
    "Panchkula": { lat: 30.6942, lng: 76.8606 },
    "Mohali": { lat: 30.7046, lng: 76.7179 }
  },
  "Pune": {
    "Koregaon Park": { lat: 18.5362, lng: 73.8930 },
    "Kothrud": { lat: 18.5074, lng: 73.8077 },
    "Viman Nagar": { lat: 18.5679, lng: 73.9143 },
    "Hinjawadi": { lat: 18.5913, lng: 73.7389 },
    "Baner": { lat: 18.5597, lng: 73.7799 },
    "Shivajinagar": { lat: 18.5308, lng: 73.8474 },
    "Camp": { lat: 18.5135, lng: 73.8778 },
    "Aundh": { lat: 18.5602, lng: 73.8031 }
  },
  "Chennai": {
    "Adyar": { lat: 13.0012, lng: 80.2565 },
    "T Nagar": { lat: 13.0418, lng: 80.2337 },
    "Velachery": { lat: 12.9815, lng: 80.2196 },
    "Nungambakkam": { lat: 13.0607, lng: 80.2407 },
    "Mylapore": { lat: 13.0330, lng: 80.2690 },
    "Anna Nagar": { lat: 13.0850, lng: 80.2101 },
    "Besant Nagar": { lat: 13.0003, lng: 80.2667 },
    "OMR": { lat: 12.9156, lng: 80.2300 }
  },
  "Kolkata": {
    "Salt Lake": { lat: 22.5804, lng: 88.4180 },
    "Park Street": { lat: 22.5529, lng: 88.3527 },
    "New Town": { lat: 22.5769, lng: 88.4799 },
    "Ballygunge": { lat: 22.5280, lng: 88.3659 },
    "Gariahat": { lat: 22.5186, lng: 88.3686 },
    "Tollygunge": { lat: 22.4930, lng: 88.3476 },
    "Alipore": { lat: 22.5298, lng: 88.3300 },
    "Dum Dum": { lat: 22.6219, lng: 88.4116 }
  },
  "Kochi": {
    "Edappally": { lat: 10.0261, lng: 76.3088 },
    "Fort Kochi": { lat: 9.9658, lng: 76.2421 },
    "Kakkanad": { lat: 10.0159, lng: 76.3504 },
    "Panampilly Nagar": { lat: 9.9634, lng: 76.2928 },
    "Vytila": { lat: 9.9723, lng: 76.3190 },
    "Marine Drive": { lat: 9.9780, lng: 76.2737 },
    "Kadavanthra": { lat: 9.9686, lng: 76.2995 },
    "Thrippunithura": { lat: 9.9482, lng: 76.3263 }
  }
};

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
    const coords = CITY_CENTER_COORDS[city];
    if (coords) {
      set({ 
        selectedCity: city, 
        selectedArea: "", 
        detectedLocation: coords,
        detectedCity: city,
        detectedArea: ""
      });
    } else {
      set({ selectedCity: city, selectedArea: "" });
    }
  },

  setSelectedArea: (area: string) => {
    const city = get().selectedCity;
    const areaCoords = AREA_COORDS[city]?.[area];
    if (areaCoords) {
      set({ 
        selectedArea: area, 
        detectedLocation: areaCoords,
        detectedArea: area
      });
    } else {
      set({ selectedArea: area });
    }
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
