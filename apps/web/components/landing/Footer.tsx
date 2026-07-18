import { PawPrint, Share2, Globe, ExternalLink, Send, Heart } from "lucide-react";
import { SectionDivider } from "./SectionDivider";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-[#1a1a1a] pb-12 pt-32 text-white">
      <SectionDivider fill="var(--gray-soft)" position="top" />

      <div className="relative z-30 mx-auto max-w-7xl px-6 pt-10">
        <div className="mb-20 grid grid-cols-1 items-center gap-12 border-b border-gray-800 pb-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-3 text-brand-orange">
              <div className="rounded-2xl bg-white/10 p-3">
                <PawPrint size={32} fill="currentColor" />
              </div>
              <span className="font-display text-4xl tracking-wide text-white">
                ANIMAPS
              </span>
            </div>
            <p className="max-w-md text-lg font-medium leading-relaxed text-gray-400">
              {/* TODO copy */}
              Plataforma dedicada a conectar corações e proteger quem não pode
              falar. Junte-se à lista de espera!
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-700 bg-gray-800/50 p-8">
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-brand-purple/20 blur-2xl" />
            <h3 className="font-display mb-2 text-2xl">
              Receba notícias fofas
            </h3>
            <p className="mb-6 font-medium text-gray-400">
              Novos recursos, histórias de adoção e dicas — em breve.
            </p>
            <form className="flex gap-2" action="#" aria-label="Newsletter">
              <input
                type="email"
                placeholder="Seu melhor e-mail..."
                disabled
                className="flex-1 rounded-full border-2 border-gray-700 bg-gray-900 px-6 py-4 font-bold text-white outline-none transition-colors placeholder:text-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled
                className="rounded-full bg-brand-green p-5 text-white shadow-lg disabled:opacity-50"
                aria-label="Enviar"
              >
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>

        <div className="mb-20 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h4 className="font-display mb-6 text-xl text-brand-blue">
              Plataforma
            </h4>
            <ul className="space-y-4 font-bold text-gray-500">
              <li>
                <a
                  href="#lista"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  Lista de espera
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a
                  href="#solucao"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  A solução
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-6 text-xl text-brand-purple">
              Sobre
            </h4>
            <ul className="space-y-4 font-bold text-gray-500">
              <li>
                <a
                  href="#problema"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  O problema
                </a>
              </li>
              <li>
                <a
                  href="#para-quem"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  Para quem é
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-6 text-xl text-brand-yellow">
              Ajuda
            </h4>
            <ul className="space-y-4 font-bold text-gray-500">
              <li>
                <a
                  href="#faq"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  id="privacidade"
                  href="#privacidade"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#termos"
                  className="block transition-all hover:pl-2 hover:text-white"
                >
                  Termos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display mb-6 text-xl text-brand-orange">
              Siga-nos
            </h4>
            <div className="flex gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-500"
                title="Redes em breve"
              >
                <Share2 size={20} />
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-500"
                title="Site"
              >
                <Globe size={20} />
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-500"
                title="Links"
              >
                <ExternalLink size={20} />
              </span>
            </div>
            <p className="mt-6 text-xs font-bold text-gray-600">
              Idioma: PT (EN em breve)
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-center md:flex-row">
          <p className="text-sm font-bold text-gray-600">
            © {new Date().getFullYear()} Animaps.
          </p>
          <p className="flex items-center gap-2 text-sm font-bold text-gray-600">
            Desenvolvido com{" "}
            <Heart
              size={16}
              className="animate-pulse text-red-500"
              fill="currentColor"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
