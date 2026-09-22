import { redirect } from "next/navigation";

/** Legacy nav alias — reports → cases (Fase 3). */
export default function ReportsRedirectPage() {
  redirect("/cases");
}
