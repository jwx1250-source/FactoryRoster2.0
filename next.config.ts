import type { NextConfig } from "next";

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
      { source: "/guides/manufacturer-vs-trading-company-china", destination: "/guides", permanent: true },
      { source: "/guides/how-to-write-custom-packaging-rfq", destination: "/guides", permanent: true },
      { source: "/guides/common-packaging-certifications-explained", destination: "/guides", permanent: true },
      { source: "/guides/how-to-find-china-packaging-manufacturers", destination: "/guides", permanent: true },
      { source: "/guides/how-to-evaluate-china-factory-profiles", destination: "/guides", permanent: true },
      { source: "/guides/china-packaging-supplier-checklist", destination: "/guides", permanent: true },
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
