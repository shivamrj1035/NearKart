export type Coordinates = {
  lat: number;
  lng: number;
};

export type Shop = {
  id: number | string;
  name: string;
  area: string;
  city: string;
  category: string;
  products: string[];
  rating: number;
  reviews: number;
  price: 1 | 2 | 3 | 4;
  open: boolean;
  distance: number;
  specialty: string;
  phone: string;
  hours: string;
  lat?: number;
  lng?: number;
};
