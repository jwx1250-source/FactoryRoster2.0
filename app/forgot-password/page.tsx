import type { Metadata } from "next";

import { RequestPasswordResetForm } from "@/components/password-reset-form";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <RequestPasswordResetForm />;
}
