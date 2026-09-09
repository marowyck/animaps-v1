"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AnimalSizeStep() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding/animal-preferences");
  }, [router]);
  return null;
}
