import { Shop } from "@/features/shops/data/shops";
import { calculateDistance } from "@/features/shops/utils/distance";

const CATEGORY_MAP: Record<string, string> = {
  supermarket: "Grocery",
  convenience: "Grocery",
  clothes: "Clothing",
  electronics: "Electronics",
  hardware: "Hardware",
  books: "Books",
  jewelry: "Jewellery",
  furniture: "Furniture",
  chemist: "Pharmacy",
  sports: "Sports",
  pet: "Pet Supplies",
  car_parts: "Automotive",
  garden_centre: "Garden"
};

type OverpassElement = {
  id: number;
  type: "node" | "way" | "relation";
  lat?: number;
  lon?: number;
  center?: {
    lat?: number;
    lon?: number;
  };
  tags?: Record<string, string>;
};

export async function fetchNearbyShopsFromOverpass(lat: number, lng: number, radius: number = 3000, city: string = "Unknown", area: string = "Unknown"): Promise<Shop[]> {
  const query = `
    [out:json];
    (
      node["shop"](around:${radius}, ${lat}, ${lng});
      way["shop"](around:${radius}, ${lat}, ${lng});
    );
    out center;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    const elements = (data.elements || []) as OverpassElement[];

    const fetchedShops: Shop[] = elements.map((element) => {
      const tags = element.tags || {};
      const shopLat = element.type === "node" ? element.lat : element.center?.lat;
      const shopLng = element.type === "node" ? element.lon : element.center?.lon;
      
      const shopType = tags.shop || "convenience";
      const mappedCategory = CATEGORY_MAP[shopType] || "General";
      
      // Calculate real distance
      let distance = 0.5;
      if (shopLat && shopLng) {
        distance = calculateDistance(lat, lng, shopLat, shopLng);
      }

      // Generate consistent mock data for missing fields based on ID
      const mockRating = 4.0 + (element.id % 10) / 10;
      const mockReviews = 10 + (element.id % 200);
      const mockPrice = (1 + (element.id % 4)) as 1 | 2 | 3 | 4;

      return {
        id: element.id,
        name: tags.name || `Local ${mappedCategory} Store`,
        area: tags["addr:suburb"] || area,
        city: tags["addr:city"] || city,
        category: mappedCategory,
        products: [mappedCategory.toLowerCase(), "essentials", "local items"],
        rating: mockRating,
        reviews: mockReviews,
        price: mockPrice,
        open: true, // Mocking open state
        distance,
        specialty: tags.description || `Specializing in ${mappedCategory.toLowerCase()}`,
        phone: tags.phone || "Not available",
        hours: tags.opening_hours || "9am–8pm",
        lat: shopLat,
        lng: shopLng
      } as Shop;
    });
    
    // Filter out completely generic unnamed shops to keep the list clean
    return fetchedShops.filter(shop => shop.name !== "Local General Store");
  } catch (error) {
    console.error("Failed to fetch shops from Overpass:", error);
    return [];
  }
}
