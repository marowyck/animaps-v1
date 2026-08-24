import { WaitlistForm } from "@/features/waitlist";
import { SectionDivider } from "./SectionDivider";

export function WaitlistSection() {
  return (
    <section
      id="lista"
      className="relative z-10 overflow-visible bg-gray-soft px-4 py-24 md:py-28"
    >
      <SectionDivider fill="var(--pastel-yellow)" position="top" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 overflow-visible pt-12 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-5">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-brand-orange">
            Lista de espera
          </p>
          <h2 className="font-display text-4xl leading-tight text-ink md:text-5xl">
            Entre na lista.{" "}
            <span className="text-brand-orange">A gente te avisa.</span>
          </h2>
          <p className="mt-5 text-lg font-bold text-ink-muted">
            {/* TODO copy */}
            Cadastro rápido — sem senha e sem documentos nesta fase.
          </p>
        </div>

        <WaitlistForm />
      </div>
    </section>
  );
}
