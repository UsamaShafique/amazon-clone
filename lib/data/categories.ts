import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    slug: "electronics",
    name: "Electronics",
    description:
      "Headphones, speakers, cameras, wearables and smart home tech from brands shoppers love.",
    emoji: "🎧",
    hue: 210,
    subcategories: [
      { slug: "audio", name: "Audio & Headphones" },
      { slug: "wearables", name: "Wearable Tech" },
      { slug: "cameras", name: "Cameras" },
      { slug: "smart-home", name: "Smart Home" },
    ],
  },
  {
    slug: "computers",
    name: "Computers & Accessories",
    description:
      "Laptops, desktops, monitors, storage and everything that plugs into them.",
    emoji: "💻",
    hue: 260,
    subcategories: [
      { slug: "laptops", name: "Laptops" },
      { slug: "desktops", name: "Desktops" },
      { slug: "monitors", name: "Monitors" },
      { slug: "accessories", name: "Keyboards & Mice" },
      { slug: "storage", name: "Storage" },
      { slug: "networking", name: "Networking" },
    ],
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    description:
      "Small appliances, cookware, furniture and decor to outfit every room.",
    emoji: "🍳",
    hue: 25,
    subcategories: [
      { slug: "appliances", name: "Small Appliances" },
      { slug: "cookware", name: "Cookware" },
      { slug: "furniture", name: "Furniture" },
      { slug: "decor", name: "Home Decor" },
      { slug: "bedding", name: "Bedding" },
    ],
  },
  {
    slug: "fashion",
    name: "Fashion",
    description:
      "Clothing, shoes, bags and watches for women, men and kids — new styles weekly.",
    emoji: "👗",
    hue: 330,
    subcategories: [
      { slug: "women", name: "Women" },
      { slug: "men", name: "Men" },
      { slug: "kids", name: "Kids" },
      { slug: "shoes", name: "Shoes" },
      { slug: "bags", name: "Bags" },
      { slug: "watches", name: "Watches" },
    ],
  },
  {
    slug: "beauty",
    name: "Beauty & Personal Care",
    description:
      "Skincare, makeup, haircare and fragrance — including customer favourites under $30.",
    emoji: "💄",
    hue: 350,
    subcategories: [
      { slug: "skincare", name: "Skincare" },
      { slug: "makeup", name: "Makeup" },
      { slug: "haircare", name: "Haircare" },
      { slug: "fragrance", name: "Fragrance" },
    ],
  },
  {
    slug: "toys-games",
    name: "Toys & Games",
    description:
      "Building sets, plush, board games, puzzles and STEM kits for every age.",
    emoji: "🧸",
    hue: 45,
    subcategories: [
      { slug: "preschool", name: "Preschool & Plush" },
      { slug: "building", name: "Building & STEM" },
      { slug: "games", name: "Board Games" },
      { slug: "outdoor-play", name: "Outdoor Play" },
      { slug: "puzzles", name: "Puzzles" },
    ],
  },
  {
    slug: "sports-outdoors",
    name: "Sports & Outdoors",
    description:
      "Fitness gear, cycling, camping and team sports equipment for indoors and out.",
    emoji: "🏋️",
    hue: 145,
    subcategories: [
      { slug: "fitness", name: "Fitness" },
      { slug: "cycling", name: "Cycling" },
      { slug: "camping", name: "Camping & Hiking" },
      { slug: "running", name: "Running" },
      { slug: "team-sports", name: "Team Sports" },
    ],
  },
  {
    slug: "books",
    name: "Books",
    description:
      "Bestselling fiction, nonfiction, children's picture books, comics and more.",
    emoji: "📚",
    hue: 200,
    subcategories: [
      { slug: "fiction", name: "Fiction" },
      { slug: "nonfiction", name: "Nonfiction" },
      { slug: "children", name: "Children's Books" },
      { slug: "comics", name: "Comics & Graphic Novels" },
      { slug: "self-help", name: "Self-Help" },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
