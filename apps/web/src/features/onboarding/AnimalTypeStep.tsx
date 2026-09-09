"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route helper — redirects into the composite animal-preferences step. */
export function AnimalTypeStep() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding/animal-preferences");
  }, [router]);
  return null;
}
