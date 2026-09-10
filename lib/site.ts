import { Boxes, CircuitBoard, CookingPot, Dumbbell, LampDesk, PackageOpen, PawPrint, Shirt, Sofa, SprayCan } from "lucide-react";
import { PRIMARY_INDUSTRIES } from "@/lib/categories";

export const siteUrl = "https://factoryroster.com";

const industryIcons = [CircuitBoard, LampDesk, PackageOpen, Boxes, Sofa, SprayCan, CookingPot, PawPrint, Shirt, Dumbbell];
export const industries = PRIMARY_INDUSTRIES.map((industry, index) => ({
  name: industry.name,
  slug: industry.slug,
  detail: industry.secondaryCategories.slice(0, 3).map((category) => category.name).join(" · "),
  icon: industryIcons[index],
}));

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
    title: "Supply Evidence",
    description: "Evidence appropriate to the supplier type is reviewed before a profile is listed.",
  },
];

export const navItems = [
  { href: "/search", label: "All Suppliers" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
];
