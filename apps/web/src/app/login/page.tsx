"use client";

import { AuthSplitLayout, LoginForm } from "@/features/auth";
import { CookieBanner } from "@/features/consent";

export default function LoginPage() {
  return (
    <>
      <AuthSplitLayout>
        <LoginForm />
      </AuthSplitLayout>
      <CookieBanner />
    </>
  );
}
