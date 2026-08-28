"use client";

import { PawPrint } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useT } from "@/i18n";
import { SectionDivider } from "./SectionDivider";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/animaps",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@animaps",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/animaps",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@animaps",
  },
] as const;

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.8a4.85 4.85 0 0 1-1-.11Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 8.5H3.5V20h3V8.5ZM5 3a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 5 3ZM20.5 20h-3v-5.6c0-1.54-.55-2.4-1.78-2.4-1.03 0-1.64.7-1.91 1.37-.1.24-.08.58-.08.92V20h-3s.04-9.76 0-10.77h3v1.53c.4-.62 1.12-1.8 2.92-1.8 2.1 0 3.85 1.37 3.85 4.32V20Z" />
    </svg>
  );
}

function YouTubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.5 7.2a3.1 3.1 0 0 0-2.18-2.2C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.32.5A3.1 3.1 0 0 0 1.5 7.2 32.6 32.6 0 0 0 1 12a32.6 32.6 0 0 0 .5 4.8 3.1 3.1 0 0 0 2.18 2.2c1.92.5 8.32.5 8.32.5s6.4 0 8.32-.5a3.1 3.1 0 0 0 2.18-2.2A32.6 32.6 0 0 0 23 12a32.6 32.6 0 0 0-.5-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
} as const;

type FooterProps = {
  /** Color of the top wave (should match the section above). Ignored when `showDivider` is false. */
  dividerFill?: string;
  /** When false, the organic top wave is omitted (e.g. CurvedLoop already paints the sine join). */
  showDivider?: boolean;
};

export function Footer({
  dividerFill = "var(--gray-soft)",
  showDivider = true,
}: FooterProps) {
  const t = useT();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t.footer.platform,
      links: [
        { href: "/#solution", label: t.footer.solution },
        { href: "/#how-it-works", label: t.footer.howItWorks },
        { href: "/#audience", label: t.footer.whoFor },
        { href: "/#faq", label: t.footer.faq },
      ],
    },
    {
      title: t.footer.account,
      links: [
        { href: "/register", label: t.footer.createAccount },
        { href: "/login", label: t.footer.login },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: "/#privacy", label: t.footer.privacy, id: "privacy" },
        { href: "/#terms", label: t.footer.terms, id: "terms" },
      ],
    },
  ];

  return (
    <footer
      className={`relative z-10 overflow-hidden bg-[#1a1214] text-white ${
        showDivider ? "pt-24" : "pt-6 md:pt-8"
      }`}
    >
      {showDivider ? (
        <SectionDivider fill={dividerFill} position="top" />
      ) : null}

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-8 md:px-6 md:pt-14 md:pb-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a
              href="/#top"
              className="inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
            >
              <PawPrint size={18} aria-hidden />
              <span className="text-sm font-semibold tracking-wide">ANIMAPS</span>
            </a>
            <p className="mt-4 text-xs leading-relaxed text-white/45">
              © {year} Animaps
            </p>
            <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-white/40">
              {t.footer.blurb}
            </p>
            <div className="mt-5">
              <LocaleSwitcher tone="dark" variant="menu" aria-label={t.footer.languageAria} />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      id={"id" in link ? link.id : undefined}
                      href={link.href}
                      className="text-sm text-white/45 transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-white">{t.footer.social}</h3>
            <ul className="mt-4 space-y-2.5">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white/80"
                    >
                      <span>{s.label}</span>
                      <Icon size={14} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none relative select-none overflow-hidden leading-none"
        aria-hidden
      >
        <p className="font-display translate-y-[18%] whitespace-nowrap text-center text-[22vw] font-normal tracking-tight text-brand-pink/55 md:text-[18vw] lg:text-[15rem]">
          ANIMAPS
        </p>
      </div>
    </footer>
  );
}
