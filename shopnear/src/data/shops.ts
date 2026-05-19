export interface Shop {
  id: number;
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
}

export const shops: Shop[] = [
  { id:1,  name:"Mehta Electronics",       area:"Alkapuri",    city:"Vadodara", category:"Electronics",    products:["mobile phones","chargers","earphones","smart watches"],            rating:4.5, reviews:128, price:2, open:true,  distance:0.8, specialty:"Best mobile accessories range in Alkapuri",      phone:"9876543210", hours:"10am–9pm"  },
  { id:2,  name:"Shree Cloth House",        area:"Sayajigunj",  city:"Vadodara", category:"Clothing",       products:["sarees","kurtis","dress material","lehengas"],                    rating:4.7, reviews:214, price:3, open:true,  distance:1.2, specialty:"Premium ethnic wear since 1978",                  phone:"9988776655", hours:"10am–8pm"  },
  { id:3,  name:"Patel Hardware & Tools",   area:"Fatehgunj",   city:"Vadodara", category:"Hardware",       products:["power tools","pipes","fittings","paints","screws"],               rating:4.3, reviews:87,  price:1, open:true,  distance:2.1, specialty:"Wholesale rates for bulk buyers",                 phone:"9001122334", hours:"9am–7pm"   },
  { id:4,  name:"Green Leaf Books",         area:"Fatehgunj",   city:"Vadodara", category:"Books",          products:["textbooks","novels","stationery","art supplies"],                 rating:4.8, reviews:305, price:1, open:false, distance:1.5, specialty:"Largest second-hand book collection",             phone:"9123456789", hours:"11am–7pm"  },
  { id:5,  name:"Silver Touch Jewellers",   area:"Alkapuri",    city:"Vadodara", category:"Jewellery",      products:["gold jewellery","silver","diamond rings","custom design"],        rating:4.6, reviews:176, price:4, open:true,  distance:0.5, specialty:"Custom design in 72 hours",                       phone:"9765432100", hours:"10am–9pm"  },
  { id:6,  name:"Organic Roots",            area:"Sayajigunj",  city:"Vadodara", category:"Grocery",        products:["organic vegetables","millets","cold-pressed oil","herbs"],        rating:4.9, reviews:412, price:2, open:true,  distance:0.9, specialty:"100% certified organic, farm to shelf",          phone:"9871234560", hours:"7am–10pm"  },
  { id:7,  name:"Furniture World",          area:"Waghodia Rd", city:"Vadodara", category:"Furniture",      products:["sofas","beds","wardrobes","dining sets","study tables"],          rating:4.2, reviews:63,  price:3, open:true,  distance:4.3, specialty:"Free delivery and assembly within city",          phone:"9000011112", hours:"10am–8pm"  },
  { id:8,  name:"Quick Pharmacy Plus",      area:"Manjalpur",   city:"Vadodara", category:"Pharmacy",       products:["medicines","supplements","baby care","surgical items"],           rating:4.4, reviews:198, price:2, open:true,  distance:3.2, specialty:"24-hour availability, all brands stocked",        phone:"9111222333", hours:"24 hours"  },
  { id:9,  name:"Craft & Clay Studio",      area:"Karelibaug",  city:"Vadodara", category:"Art & Craft",    products:["pottery","canvas","craft kits","fabric paints","clay"],           rating:4.7, reviews:89,  price:2, open:false, distance:2.7, specialty:"Workshops available on weekends",                 phone:"9222333444", hours:"10am–6pm"  },
  { id:10, name:"Cycle & Sport Hub",        area:"Subhanpura",  city:"Vadodara", category:"Sports",         products:["bicycles","cricket gear","badminton","gym equipment"],            rating:4.5, reviews:142, price:2, open:true,  distance:1.8, specialty:"Gear repair and servicing available",            phone:"9333444555", hours:"9am–8pm"   },
  { id:11, name:"Laptop Clinic",            area:"Alkapuri",    city:"Vadodara", category:"Electronics",    products:["laptops","RAM upgrades","SSD","laptop bags","cooling pads"],      rating:4.6, reviews:231, price:2, open:true,  distance:0.6, specialty:"Same-day repair for most issues",                 phone:"9444555666", hours:"10am–9pm"  },
  { id:12, name:"Bombay Fabric Store",      area:"Raopura",     city:"Vadodara", category:"Clothing",       products:["cotton fabric","silk","linen","embroidery cloth","thread"],       rating:4.4, reviews:167, price:2, open:true,  distance:3.8, specialty:"Wholesale rates on fabric above 10m",             phone:"9555666777", hours:"9am–8pm"   },
  { id:13, name:"Kitchen Bazaar",           area:"Manjalpur",   city:"Vadodara", category:"Home & Kitchen", products:["cookware","appliances","storage","cutlery","pressure cookers"],   rating:4.3, reviews:94,  price:2, open:true,  distance:3.5, specialty:"Best cookware variety in south Vadodara",         phone:"9666777888", hours:"10am–8pm"  },
  { id:14, name:"Pet Paradise",             area:"Karelibaug",  city:"Vadodara", category:"Pet Supplies",   products:["dog food","cat food","grooming kits","cages","accessories"],      rating:4.8, reviews:276, price:2, open:true,  distance:2.4, specialty:"Vet consultation on Saturdays",                   phone:"9777888999", hours:"9am–9pm"   },
  { id:15, name:"AutoParts Direct",         area:"Waghodia Rd", city:"Vadodara", category:"Automotive",     products:["car parts","oil filters","batteries","accessories","tools"],      rating:4.1, reviews:58,  price:2, open:false, distance:5.1, specialty:"Genuine OEM parts guaranteed",                    phone:"9888999000", hours:"9am–7pm"   },
  { id:16, name:"Garden & Bloom",           area:"Subhanpura",  city:"Vadodara", category:"Garden",         products:["plants","pots","fertilizers","seeds","garden tools"],             rating:4.6, reviews:189, price:1, open:true,  distance:2.0, specialty:"Rare indoor plants available",                    phone:"9000111222", hours:"7am–8pm"   },
];
