export const guideRedirects = {
  "use-verified-factory-contacts": "how-to-contact-chinese-manufacturers",
  "how-to-write-custom-packaging-rfq": "",
  "common-packaging-certifications-explained": "",
  "how-to-find-china-packaging-manufacturers": "",
  "how-to-evaluate-china-factory-profiles": "",
  "china-packaging-supplier-checklist": "",
} as const;

export function isRedirectedGuide(slug: string) {
  return Object.hasOwn(guideRedirects, slug);
}
