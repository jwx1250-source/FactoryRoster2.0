import type { NextConfig } from "next";
import { guideRedirects } from "./lib/guide-redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    const packagingIndustry = "/industries/packaging-and-printing";
    return [
      { source: "/china-manufacturers", destination: "/industries", permanent: true },
      { source: "/categories", destination: "/industries", permanent: true },
      { source: "/rfq", destination: "/request-verification", permanent: true },
      { source: "/for-suppliers", destination: "/contact", permanent: true },
      { source: "/report-incorrect", destination: "/contact", permanent: true },
      { source: "/how-factoryroster-works", destination: "/verification", permanent: true },
      ...Object.entries(guideRedirects).map(([from, to]) => ({
        source: `/guides/${from}`,
        destination: to ? `/guides/${to}` : "/guides",
        permanent: true,
      })),
      { source: "/china-manufacturers/mailer-boxes", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/labels-and-stickers", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/cosmetic-packaging", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/gift-boxes", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/cardboard-boxes", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/rigid-boxes", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/food-packaging", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/flexible-packaging", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/printing-packaging", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/custom-packaging", destination: packagingIndustry, permanent: true },
      { source: "/china-manufacturers/kraft-packaging", destination: packagingIndustry, permanent: true },
      { source: "/rfq/custom-packaging", destination: packagingIndustry, permanent: true },
      { source: "/rfq/kraft-packaging", destination: packagingIndustry, permanent: true },
      { source: "/rfq/flexible-packaging", destination: packagingIndustry, permanent: true },
      { source: "/rfq/printing-packaging", destination: packagingIndustry, permanent: true },
      { source: "/rfq/mailer-boxes", destination: packagingIndustry, permanent: true },
      { source: "/rfq/paper-bags", destination: packagingIndustry, permanent: true },
      { source: "/rfq/gift-boxes", destination: packagingIndustry, permanent: true },
      { source: "/rfq/labels-and-stickers", destination: packagingIndustry, permanent: true },
      { source: "/rfq/cosmetic-packaging", destination: packagingIndustry, permanent: true },
      { source: "/rfq/rigid-boxes", destination: packagingIndustry, permanent: true },
    ];
  },
};

export default nextConfig;
