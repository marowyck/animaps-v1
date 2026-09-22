"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  Map,
  Plug,
  Users,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";
import { SummaryCard } from "@/features/dashboard";
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
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            {t.institution.overview.pendingTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {t.institution.overview.pendingSubtitle}
          </p>
        </header>
        <SoftGateBanner variant="panel" />
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              {t.institution.overview.verification}
            </p>
            <p className="font-bold text-ink">{name}</p>
          </div>
          <VerificationStatusBadge status={status} label={statusLabel} />
        </Card>
      </div>
    );
  }

  const tiles = [
    {
      id: "new",
      title: t.institution.overview.metrics.new,
      value: String(metrics.newCount),
      icon: ClipboardList,
    },
    {
      id: "review",
      title: t.institution.overview.metrics.inReview,
      value: String(metrics.inReview),
      icon: AlertTriangle,
    },
    {
      id: "progress",
      title: t.institution.overview.metrics.inProgress,
      value: String(metrics.inProgress),
      icon: CheckCircle2,
    },
    {
      id: "priority",
      title: t.institution.overview.metrics.priority,
      value: String(metrics.priority),
      icon: AlertTriangle,
    },
    {
      id: "closed",
      title: t.institution.overview.metrics.closed,
      value: String(metrics.closed),
      icon: CheckCircle2,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            {t.institution.overview.title.replace("{name}", name)}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {t.institution.overview.subtitle}
          </p>
        </div>
        <VerificationStatusBadge status={status} label={statusLabel} />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <SummaryCard
            key={tile.id}
            title={tile.title}
            value={tile.value}
            icon={tile.icon}
          />
        ))}
      </div>

      <Card className="p-4">
        <p className="text-sm font-semibold text-ink-muted">
          {t.institution.overview.totalLabel.replace(
            "{count}",
            String(metrics.total),
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button href="/cases" variant="pink" size="sm">
            {t.institution.overview.openInbox}
          </Button>
          <Button href="/cases/new" variant="ghost" size="sm">
            {t.cases.list.createCta}
          </Button>
        </div>
      </Card>

      <section>
        <h2 className="mb-2 text-sm font-bold text-ink">
          {t.institution.overview.modulesTitle}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <ModuleLink
            href="/map"
            icon={Map}
            title={t.dashboard.nav.map ?? "Map"}
            body={t.institution.overview.moduleMap}
          />
          <ModuleLink
            href="/analytics"
            icon={BarChart3}
            title={t.dashboard.nav.analytics ?? "Analytics"}
            body={t.institution.overview.moduleAnalytics}
          />
          <ModuleLink
            href="/team"
            icon={Users}
            title={t.dashboard.nav.team ?? "Team"}
            body={t.institution.overview.moduleTeam}
          />
          <ModuleLink
            href="/routing"
            icon={GitBranch}
            title={t.dashboard.nav.routing ?? "Routing"}
            body={t.institution.overview.moduleRouting}
          />
          <ModuleLink
            href="/integrations"
            icon={Plug}
            title={t.dashboard.nav.integrations ?? "Integrations"}
            body={t.institution.overview.moduleIntegrations}
          />
          <ModuleLink
            href="/institution"
            icon={Building2}
            title={t.dashboard.nav.institution ?? "Institution"}
            body={t.institution.overview.moduleInstitution}
          />
        </ul>
      </section>

      <p className="text-xs text-ink-muted">{t.institution.overview.honesty}</p>
    </div>
  );
}

function ModuleLink({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: typeof Map;
  title: string;
  body: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex gap-3 rounded-2xl border-2 border-border-soft bg-white px-4 py-3 transition-colors hover:border-brand-green/40 hover:bg-pastel-green/20"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-pastel-green text-brand-green">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-ink">{title}</span>
          <span className="block text-xs text-ink-muted">{body}</span>
        </span>
      </Link>
    </li>
  );
}
