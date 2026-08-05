import { History, Network, UserRound } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeAuditoriaTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";
import {
  formatPppoeDate,
  getAuditTitle,
  getAuditTone,
  humanizePppoeEnum,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.utils";

import { AuditoriaJsonDetails } from "./auditoria-json-details";

type Props = {
  item: InstalacionPppoeAuditoriaTimelineItem;
};

export function AuditoriaIndependienteCard({ item }: Props) {
  const { auditoria, contexto } = item;
  const actor =
    auditoria.operador?.nombre ??
    auditoria.operadorNombreSnapshot ??
    "Sistema";

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        <AppInline
          justify="between"
          align="start"
          gap="sm"
          collapseBelow="sm"
          fullWidth
        >
          <div className="min-w-0">
            <AppInline align="center" gap="xs" wrap>
              <History className="size-4" aria-hidden="true" />
              <h3 className="text-sm font-semibold">
                {getAuditTitle(auditoria.accion)}
              </h3>
              <AppBadge
                tone={getAuditTone(auditoria.accion)}
                appearance="soft"
                size="xs"
                radius="full"
              >
                {humanizePppoeEnum(auditoria.origen)}
              </AppBadge>
            </AppInline>

            <p className="mt-1 text-xs">{auditoria.descripcion}</p>
          </div>

          <span className="shrink-0 text-[11px] text-[hsl(var(--app-muted-foreground))]">
            {formatPppoeDate(item.fecha)}
          </span>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="sm">
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Operador
            </p>
            <AppInline align="center" gap="xs" wrap={false}>
              <UserRound className="size-3.5" aria-hidden="true" />
              <span className="truncate text-[11px] font-medium">{actor}</span>
            </AppInline>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Usuario PPPoE
            </p>
            <p className="text-[11px] font-medium">
              {auditoria.usuarioPppoeSnapshot ??
                contexto.cuentaPppoe?.usuario ??
                "Sin registrar"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Perfil
            </p>
            <AppInline align="center" gap="xs" wrap={false}>
              <Network className="size-3.5" aria-hidden="true" />
              <span className="text-[11px] font-medium">
                {auditoria.perfilCodigoSnapshot ??
                  contexto.perfilHomologacion?.codigoPerfil ??
                  "Sin registrar"}
              </span>
            </AppInline>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground))]">
              Transición
            </p>
            <p className="text-[11px] font-medium">
              {auditoria.estadoCuentaAnterior || auditoria.estadoCuentaNuevo
                ? `${humanizePppoeEnum(
                    auditoria.estadoCuentaAnterior,
                  )} → ${humanizePppoeEnum(auditoria.estadoCuentaNuevo)}`
                : "Sin transición"}
            </p>
          </div>
        </AppGrid>

        {auditoria.ipOrigen || auditoria.userAgent ? (
          <div className="rounded bg-[hsl(var(--app-muted)/0.55)] p-2">
            <p className="text-[10px]">
              IP: {auditoria.ipOrigen ?? "Sin registrar"}
            </p>
            {auditoria.userAgent ? (
              <p className="mt-1 break-all text-[10px] text-[hsl(var(--app-muted-foreground))]">
                {auditoria.userAgent}
              </p>
            ) : null}
          </div>
        ) : null}

        <AuditoriaJsonDetails
          title="Ver datos del evento"
          value={auditoria.datos}
        />
      </AppStack>
    </AppCard>
  );
}
