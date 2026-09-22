"use client";

import Link from "next/link";
import {
  BarChart3,
  Building2,
  GitBranch,
  Map,
  Plug,
  Users,
} from "lucide-react";
import { Button } from "@/components/Button";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";
import { MetricTile } from "./MetricTile";
import { useCasesStore } from "@/features/cases";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { SoftGateBanner } from "./SoftGateBanner";
import { computeCaseMetrics, isInstitutionOperational } from "./metrics";

/**
 * Government workspace home — case KPIs only. No Discover / match cards.
 */
export function InstitutionDashboard() {
  const t = useT();
  const { draft } = useOnboarding();
  const { cases } = useCasesStore();
  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const metrics = computeCaseMetrics(cases);
  const name =
    draft.institution.publicName.trim() ||
    draft.institution.officialName.trim() ||
    draft.displayName?.trim() ||
    t.institution.overview.unnamed;

  const status = draft.institutionalVerificationStatus;
  const statusLabel =
    t.onboarding.verification.status[status] ?? status;

  if (!verified) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-h1 text-text">
            {t.institution.overview.pendingTitle}
          </h1>
          <p className="mt-2 max-w-xl text-body-sm text-text-secondary">
            {t.institution.overview.pendingSubtitle}
          </p>
        </header>
        <SoftGateBanner variant="panel" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-caption font-semibold text-text-muted">
              {t.institution.overview.verification}
            </p>
            <p className="font-display text-2xl text-text">{name}</p>
          </div>
          <VerificationStatusBadge status={status} label={statusLabel} />
        </div>
      </div>
    );
  }

  const tiles = [
    {
      id: "new",
      title: t.institution.overview.metrics.new,
      value: String(metrics.newCount),
    },
    {
      id: "review",
      title: t.institution.overview.metrics.inReview,
      value: String(metrics.inReview),
    },
    {
      id: "progress",
      title: t.institution.overview.metrics.inProgress,
      value: String(metrics.inProgress),
    },
    {
      id: "priority",
      title: t.institution.overview.metrics.priority,
      value: String(metrics.priority),
    },
    {
      id: "closed",
      title: t.institution.overview.metrics.closed,
      value: String(metrics.closed),
    },
  ] as const;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-h1 text-text">
            {t.institution.overview.title.replace("{name}", name)}
          </h1>
          <p className="mt-2 max-w-xl text-body-sm text-text-secondary">
            {t.institution.overview.subtitle}
          </p>
        </div>
        <VerificationStatusBadge status={status} label={statusLabel} />
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {tiles.map((tile, index) => (
          <MetricTile key={tile.id} label={tile.title} value={tile.value} tone={index} />
        ))}
      </div>

      <section>
        <p className="text-caption font-semibold text-text-muted">
          {t.institution.overview.totalLabel.replace("{count}", String(metrics.total))}
        </p>
        <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-background-secondary">
          {(
            [
              ["bg-info", metrics.newCount],
              ["bg-warning", metrics.inReview],
              ["bg-primary", metrics.inProgress],
              ["bg-success", metrics.closed],
            ] as const
          ).map(([color, value]) =>
            metrics.total > 0 && value > 0 ? (
              <span
                key={color}
                className={color}
                style={{ width: `${(value / metrics.total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button href="/cases" variant="primary" size="sm">
          {t.institution.overview.openInbox}
        </Button>
        <Button href="/cases/new" variant="ghost" size="sm">
          {t.cases.list.createCta}
        </Button>
      </div>

      <section>
        <h2 className="text-h4 mb-3 text-text">
          {t.institution.overview.modulesTitle}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <ModuleLink
            href="/map"
            icon={Map}
            tone={MODULE_TONES[0]}
            title={t.dashboard.nav.map ?? "Map"}
            body={t.institution.overview.moduleMap}
          />
          <ModuleLink
            href="/analytics"
            icon={BarChart3}
            tone={MODULE_TONES[1]}
            title={t.dashboard.nav.analytics ?? "Analytics"}
            body={t.institution.overview.moduleAnalytics}
          />
          <ModuleLink
            href="/team"
            icon={Users}
            tone={MODULE_TONES[2]}
            title={t.dashboard.nav.team ?? "Team"}
            body={t.institution.overview.moduleTeam}
          />
          <ModuleLink
            href="/routing"
            icon={GitBranch}
            tone={MODULE_TONES[3]}
            title={t.dashboard.nav.routing ?? "Routing"}
            body={t.institution.overview.moduleRouting}
          />
          <ModuleLink
            href="/integrations"
            icon={Plug}
            tone={MODULE_TONES[4]}
            title={t.dashboard.nav.integrations ?? "Integrations"}
            body={t.institution.overview.moduleIntegrations}
          />
          <ModuleLink
            href="/institution"
            icon={Building2}
            tone={MODULE_TONES[5]}
            title={t.dashboard.nav.institution ?? "Institution"}
            body={t.institution.overview.moduleInstitution}
          />
        </ul>
      </section>

      <p className="text-xs text-ink-muted">{t.institution.overview.honesty}</p>
    </div>
  );
}

const MODULE_TONES = [
  "bg-primary-soft text-(--pink-700)",
  "bg-info-soft text-(--sky-700)",
  "bg-secondary-soft text-(--lilac-700)",
  "bg-success-soft text-(--mint-700)",
  "bg-warning-soft text-(--honey-700)",
  "bg-primary-soft text-(--pink-700)",
] as const;

function ModuleLink({
  href,
  icon: Icon,
  title,
  body,
  tone,
}: {
  href: string;
  icon: typeof Map;
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-[1.4rem] px-2 py-2 transition-colors hover:bg-primary-soft/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full ${tone}`}>
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-lg leading-tight text-text">{title}</span>
          <span className="block text-body-sm text-text-secondary">{body}</span>
        </span>
      </Link>
    </li>
  );
}
