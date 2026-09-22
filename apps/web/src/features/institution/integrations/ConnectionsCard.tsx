"use client";

import { FormEvent } from "react";
import { Cable, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import type {
  IntegrationConnectionRecord,
  IntegrationKind,
  IntegrationSyncStatus,
} from "./types";
import { INTEGRATION_KINDS } from "./types";

type ConnectionsCardProps = {
  canManage: boolean;
  connections: IntegrationConnectionRecord[];
  name: string;
  kind: IntegrationKind;
  endpointUrl: string;
  notes: string;
  onNameChange: (value: string) => void;
  onKindChange: (value: IntegrationKind) => void;
  onEndpointUrlChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onCreate: (e: FormEvent) => void;
  onSync: (id: string) => { ok: boolean };
  onSetStatus: (id: string, status: IntegrationSyncStatus) => void;
  onRemove: (id: string) => void;
};

export function ConnectionsCard({
  canManage,
  connections,
  name,
  kind,
  endpointUrl,
  notes,
  onNameChange,
  onKindChange,
  onEndpointUrlChange,
  onNotesChange,
  onCreate,
  onSync,
  onSetStatus,
  onRemove,
}: ConnectionsCardProps) {
  const t = useT();
  const { toast } = useToast();

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Cable className="size-4 text-brand-blue" aria-hidden />
        <h2 className="text-sm font-bold text-ink">
          {t.institution.integrations.connectionsTitle}
        </h2>
      </div>
      <p className="text-xs text-ink-muted">
        {t.institution.integrations.connectionsHint}
      </p>

      {canManage ? (
        <form onSubmit={onCreate} className="grid gap-2 sm:grid-cols-2">
          <Input
            label={t.institution.integrations.connName}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.institution.integrations.connKind}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={kind}
              onChange={(e) => onKindChange(e.target.value as IntegrationKind)}
            >
              {INTEGRATION_KINDS.map((k) => (
                <option key={k} value={k}>
                  {t.institution.integrations.kinds[k]}
                </option>
              ))}
            </select>
          </label>
          <Input
            label={t.institution.integrations.endpointUrl}
            value={endpointUrl}
            onChange={(e) => onEndpointUrlChange(e.target.value)}
            placeholder="https://…"
          />
          <Input
            label={t.institution.integrations.notes}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
          <p className="sm:col-span-2 text-xs text-ink-muted">
            {t.institution.integrations.noSecrets}
          </p>
          <div>
            <Button type="submit" size="sm" variant="pink">
              {t.institution.integrations.addConnection}
            </Button>
          </div>
        </form>
      ) : null}

      {connections.length === 0 ? (
        <p className="text-xs text-ink-muted">
          {t.institution.integrations.noConnections}
        </p>
      ) : (
        <ul className="divide-y divide-border-soft">
          {connections.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-ink">{c.name}</p>
                <p className="text-xs text-ink-muted">
                  {t.institution.integrations.kinds[c.kind]} ·{" "}
                  {t.institution.integrations.providers[c.provider] ??
                    c.provider}{" "}
                  · {t.institution.integrations.statuses[c.status]}
                </p>
                {c.config.endpointUrl ? (
                  <p className="mt-1 truncate text-xs text-ink-muted">
                    {c.config.endpointUrl}
                  </p>
                ) : null}
              </div>
              {canManage ? (
                <div className="flex flex-wrap gap-2">
                  {c.status !== "disabled" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const result = onSync(c.id);
                        toast({
                          message: result.ok
                            ? t.institution.integrations.syncOk
                            : t.institution.integrations.syncFail,
                          tone: result.ok ? "success" : "warning",
                        });
                      }}
                    >
                      {t.institution.integrations.runSync}
                    </Button>
                  ) : null}
                  {c.status === "disabled" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onSetStatus(c.id, "pending");
                        toast({
                          message: t.institution.integrations.reenabled,
                          tone: "success",
                        });
                      }}
                    >
                      {t.institution.integrations.enable}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onSetStatus(c.id, "disabled");
                        toast({
                          message: t.institution.integrations.disabled,
                          tone: "success",
                        });
                      }}
                    >
                      {t.institution.integrations.disable}
                    </Button>
                  )}
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-ink-muted hover:bg-pastel-pink/40 hover:text-brand-pink"
                    aria-label={t.institution.integrations.remove}
                    onClick={() => {
                      onRemove(c.id);
                      toast({
                        message: t.institution.integrations.connectionRemoved,
                        tone: "success",
                      });
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
