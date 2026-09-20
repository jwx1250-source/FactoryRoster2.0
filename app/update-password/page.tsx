import type { Metadata } from "next";

import { UpdatePasswordForm } from "@/components/password-reset-form";

export const metadata: Metadata = { title: "Choose New Password", robots: { index: false, follow: false } };

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
