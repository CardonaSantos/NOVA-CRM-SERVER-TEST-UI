import type { ReactNode } from "react";
import {
  Activity,
  ChevronDown,
  CircleUserRound,
  Network,
  Router,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeOperacionTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  formatPppoeDate,
  formatPppoeDuration,
  getAccountTone,
  getOperationTitle,
  getOperationTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

import { AuditoriaEventos } from "./auditoria-eventos";
import { AuditoriaJsonDetails } from "./auditoria-json-details";
import { AuditoriaOperacionPasos } from "./auditoria-operacion-pasos";
import { AuditoriaReintentarOperacionButton } from "./auditoria-reintentar-button";

type Props = {
  item: InstalacionPppoeOperacionTimelineItem;

  canRetry: boolean;

  onRetrySuccess?: () => void;
};

function ContextItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
        {label}
      </p>

      <div className="mt-0.5 text-[11px] font-medium">{value}</div>
    </div>
  );
}

export function AuditoriaOperacionCard({
  item,
  canRetry,
  onRetrySuccess,
}: Props) {
  const { operacion, contexto, actores } = item;

  const actor =
    actores.iniciadoPor?.nombre ??
    actores.reautenticadoPor?.nombre ??
    "Sistema";

  const hasError = Boolean(operacion.errorCodigo || operacion.errorMensaje);

  return (
    <AppCard>
      <details className="group">
        <summary className="cursor-pointer list-none px-3 py-3">
          <AppStack gap="sm">
            <AppInline justify="between" align="start" gap="sm" wrap={false}>
              <AppInline align="start" gap="sm" wrap={false}>
                <Activity
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <AppInline align="center" gap="xs" wrap>
                    <p className="text-sm font-semibold">
                      {getOperationTitle(operacion.tipo)}
                    </p>

                    <AppBadge
                      tone={getOperationTone(operacion.estado)}
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {humanizePppoeEnum(operacion.estado)}
                    </AppBadge>
                  </AppInline>

                  <p className="mt-1 text-[11px] text-[hsl(var(--app-muted-foreground))]">
                    {formatPppoeDate(item.fecha)} · {operacion.canal} · Intento{" "}
                    {operacion.numeroIntento} ·{" "}
                    {formatPppoeDuration(operacion.duracionMs)}
                  </p>
                </div>
              </AppInline>

              <AppInline align="center" gap="xs" wrap={false}>
                <span className="hidden text-[11px] text-[hsl(var(--app-muted-foreground))] sm:inline">
                  Ver trazabilidad
                </span>

                <ChevronDown
                  className="size-4 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </AppInline>
            </AppInline>

            <AppGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="xs">
              <ContextItem
                label="Operador"
                value={
                  <AppInline align="center" gap="xs" wrap={false}>
                    <CircleUserRound
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="truncate">{actor}</span>
                  </AppInline>
                }
              />

              <ContextItem
                label="Cuenta"
                value={
                  <AppInline align="center" gap="xs" wrap>
                    <span>Usuario {contexto.cuentaPppoe.usuario}</span>

                    <AppBadge
                      tone={getAccountTone(contexto.cuentaPppoe.estado)}
                      appearance="soft"
                      size="xs"
                      radius="full"
                    >
                      {humanizePppoeEnum(contexto.cuentaPppoe.estado)}
                    </AppBadge>
                  </AppInline>
                }
              />

              <ContextItem
                label="Perfil"
                value={
                  <AppInline align="center" gap="xs" wrap={false}>
                    <Network className="size-3.5 shrink-0" aria-hidden="true" />

                    <span className="truncate">
                      {contexto.perfilHomologacion?.codigoPerfil ??
                        "Sin perfil"}
                    </span>
                  </AppInline>
                }
              />

              <ContextItem
                label="Router"
                value={
                  <AppInline align="center" gap="xs" wrap={false}>
                    <Router className="size-3.5 shrink-0" aria-hidden="true" />

                    <span className="truncate">{contexto.router.nombre}</span>
                  </AppInline>
                }
              />
            </AppGrid>
          </AppStack>
        </summary>

        <div className="px-3 pb-3">
          <AppSeparator size="xs" spacing="sm" />

          <AppStack gap="sm">
            <AppGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="sm">
              <ContextItem label="Operación" value={`#${operacion.id}`} />

              <ContextItem
                label="Idempotencia"
                value={
                  <code className="break-all text-[10px]">
                    {operacion.claveIdempotencia}
                  </code>
                }
              />

              <ContextItem
                label="Host"
                value={`${contexto.router.host}:${contexto.router.sshPort}`}
              />

              <ContextItem
                label="Plan"
                value={
                  contexto.perfilHomologacion?.servicioInternet.nombre ??
                  contexto.accesoInternet.servicioInternet?.nombre ??
                  "Sin plan"
                }
              />
            </AppGrid>

            {operacion.motivo ? (
              <div>
                <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
                  Motivo
                </p>

                <p className="mt-0.5 text-xs">{operacion.motivo}</p>
              </div>
            ) : null}

            {hasError ? (
              <AppAlert
                tone="danger"
                size="xs"
                title={operacion.errorCodigo ?? "OPERACION_FALLIDA"}
              >
                {operacion.errorMensaje ?? "Sin mensaje de error."}
              </AppAlert>
            ) : null}

            {canRetry ? (
              <AuditoriaReintentarOperacionButton
                item={item}
                onSuccess={onRetrySuccess}
              />
            ) : null}

            <AuditoriaJsonDetails
              title="Ver resultado técnico"
              value={operacion.resultado}
            />

            <details>
              <summary className="cursor-pointer text-xs font-semibold text-[hsl(var(--app-primary))]">
                Pasos técnicos ({item.pasos.length})
              </summary>

              <div className="mt-2">
                <AuditoriaOperacionPasos pasos={item.pasos} />
              </div>
            </details>

            <details>
              <summary className="cursor-pointer text-xs font-semibold text-[hsl(var(--app-primary))]">
                Eventos de auditoría ({item.auditorias.length})
              </summary>

              <div className="mt-2">
                <AuditoriaEventos auditorias={item.auditorias} compact />
              </div>
            </details>
          </AppStack>
        </div>
      </details>
    </AppCard>
  );
}
