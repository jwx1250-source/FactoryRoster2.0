import {
  Boxes,
  CircuitBoard,
  CookingPot,
  Dumbbell,
  LampDesk,
  PackageOpen,
  PawPrint,
  Shirt,
  Sofa,
  SprayCan,
} from "lucide-react";

export const siteUrl = "https://factoryroster.com";

export const industries = [
  { name: "LED Lighting", slug: "led-lighting", detail: "Fixtures · Drivers · Components", icon: LampDesk },
  { name: "Cosmetic Packaging", slug: "cosmetic-packaging", detail: "Jars · Tubes · Pumps", icon: SprayCan },
  { name: "Paper Boxes", slug: "paper-boxes", detail: "Rigid · Folding · Printed", icon: PackageOpen },
  { name: "Plastic Bottles", slug: "plastic-bottles", detail: "PET · HDPE · Custom molding", icon: Boxes },
  { name: "Furniture", slug: "furniture", detail: "Home · Office · Outdoor", icon: Sofa },
  { name: "Kitchenware", slug: "kitchenware", detail: "Cookware · Tools · Storage", icon: CookingPot },
  { name: "Pet Products", slug: "pet-products", detail: "Accessories · Care · Travel", icon: PawPrint },
  { name: "Sports Goods", slug: "sports-goods", detail: "Fitness · Outdoor · Team", icon: Dumbbell },
  { name: "Electronics", slug: "electronics", detail: "Devices · Components · OEM", icon: CircuitBoard },
  { name: "Home Textiles", slug: "home-textiles", detail: "Bedding · Towels · Fabrics", icon: Shirt },
];

export const verificationChecks = [
  {
    title: "Government Registration",
    description: "Registration status and legal entity details are checked against available government records.",
  },
  {
    title: "Business Contact",
    description: "A working business contact channel is independently checked and recorded.",
  },
  {
    title: "Factory Evidence",
    description: "Factory identity and operating evidence are reviewed before a profile is listed.",
  },
];

export const navItems = [
  { href: "/search", label: "All Factories" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
];
