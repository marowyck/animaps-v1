"use client";

import { AuthSplitLayout, RegisterForm } from "@/features/auth";
import { CookieBanner } from "@/features/consent";

export default function RegisterPage() {
  return (
    <>
      <AuthSplitLayout>
        <RegisterForm />
      </AuthSplitLayout>
      <CookieBanner />
    </>
  );
}
