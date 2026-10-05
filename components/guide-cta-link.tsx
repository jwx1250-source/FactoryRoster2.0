"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackGuideCtaClick } from "@/lib/guide-analytics";

export function GuideCtaLink({ href, guideSlug, guideCluster, destination, position, children, className }: { href: string; guideSlug: string; guideCluster: string; destination: string; position: string; children: ReactNode; className?: string }) {
  return <Link className={className} href={href} onClick={() => trackGuideCtaClick({ guide_slug: guideSlug, guide_cluster: guideCluster, destination, position })}>{children}</Link>;
}
