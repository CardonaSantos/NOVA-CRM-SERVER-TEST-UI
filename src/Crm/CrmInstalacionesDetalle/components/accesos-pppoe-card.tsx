import { memo, useCallback } from "react";
import {
  KeyRound,
  RefreshCcw,
  Router,
  ShieldCheck,
  UserRound,
  Wifi,
} from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  formatEnumValue,
  getActionDisabledReason,
  type InstalacionDetalleActionRequest,
} from "../tecnico-instalacion-detalle.utils";
import { DetailValueRow } from "./detail-value-row";
import { DetalleSectionCard } from "./detalle-section-card";

type AccesosPppoeCardProps = {
  detalle: DetalleInstalacionTecnicaResponse;
  onAction?: (request: InstalacionDetalleActionRequest) => void;
};

export const AccesosPppoeCard = memo(function AccesosPppoeCard({
  detalle,
  onAction,
}: AccesosPppoeCardProps) {
  return (
    <DetalleSectionCard
      id="acceso-pppoe"
      title="Acceso PPPoE"
      icon={Router}
      trailing={
        <span className="text-xs text-muted-foreground">
          {detalle.accesos.length}
        </span>
      }
    >
      {detalle.accesos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin accesos vinculados.</p>
      ) : (
        <AppStack gap="sm">
          {detalle.accesos.map((acceso) => (
            <AccesoPppoeItem
              key={acceso.vinculoId}
              acceso={acceso}
              detalle={detalle}
              onAction={onAction}
            />
          ))}
        </AppStack>
      )}
    </DetalleSectionCard>
  );
});

type AccesoPppoeItemProps = {
  acceso: DetalleInstalacionTecnicaResponse["accesos"][number];
  detalle: DetalleInstalacionTecnicaResponse;
  onAction?: (request: InstalacionDetalleActionRequest) => void;
};

const AccesoPppoeItem = memo(function AccesoPppoeItem({
  acceso,
  detalle,
  onAction,
}: AccesoPppoeItemProps) {
  const revealDisabledReason = getActionDisabledReason(
    detalle,
    "revelarCredenciales",
    Boolean(onAction),
  );
  const retryDisabledReason = getActionDisabledReason(
    detalle,
    "reintentarPrealta",
    Boolean(onAction),
  );

  const handleReveal = useCallback(() => {
    onAction?.({
      action: "revelarCredenciales",
      instalacionId: detalle.id,
      accesoInternetId: acceso.accesoInternetId,
    });
  }, [acceso.accesoInternetId, detalle.id, onAction]);

  const handleRetry = useCallback(() => {
    onAction?.({
      action: "reintentarPrealta",
      instalacionId: detalle.id,
      accesoInternetId: acceso.accesoInternetId,
    });
  }, [acceso.accesoInternetId, detalle.id, onAction]);

  return (
    <article className="rounded-md border border-border px-3 py-3">
      <AppStack gap="sm">
        <AppInline justify="between" align="start" gap="sm" fullWidth>
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">
              {formatEnumValue(acceso.tecnologia)}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {formatEnumValue(acceso.metodoAutenticacion)}
            </div>
          </div>
          <AppBadge tone="info" size="xs" dot>
            {formatEnumValue(acceso.estado)}
          </AppBadge>
        </AppInline>

        {acceso.cuentaPppoe ? (
          <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
            <DetailValueRow
              icon={UserRound}
              label="Usuario"
              value={acceso.cuentaPppoe.usuario}
              emphasize
            />
            <DetailValueRow
              icon={ShieldCheck}
              label="Perfil"
              value={acceso.cuentaPppoe.codigoPerfil}
            />
            <DetailValueRow
              icon={Router}
              label="Router"
              value={acceso.cuentaPppoe.routerNombre}
            />
            <DetailValueRow
              icon={Wifi}
              label="Cuenta"
              value={formatEnumValue(acceso.cuentaPppoe.estado)}
            />
          </AppGrid>
        ) : (
          <div className="rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Cuenta PPPoE pendiente.
          </div>
        )}


        {acceso.configuracionTecnica ? (
          <AppGrid cols={{ base: 2, sm: 3 }} gap="xs">
            <TechnicalMetric
              label="RX"
              value={formatMetric(acceso.configuracionTecnica.potenciaOpticaRxDbm, "dBm")}
            />
            <TechnicalMetric
              label="Señal"
              value={formatMetric(acceso.configuracionTecnica.senalInalambricaDbm, "dBm")}
            />
            <TechnicalMetric
              label="IPv4"
              value={acceso.configuracionTecnica.ipv4 ?? "Pendiente"}
            />
            <TechnicalMetric
              label="SSID"
              value={acceso.configuracionTecnica.ssid ?? "Pendiente"}
            />
            <TechnicalMetric
              label="Canal"
              value={formatMetric(acceso.configuracionTecnica.canal)}
            />
            <TechnicalMetric
              label="Banda"
              value={formatEnumValue(acceso.configuracionTecnica.bandaWifi)}
            />
          </AppGrid>
        ) : null}

        {acceso.cuentaPppoe?.ultimoError ? (
          <div
            className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger-foreground"
            role="alert"
          >
            {acceso.cuentaPppoe.ultimoError}
          </div>
        ) : null}

        <AppInline gap="xs" wrap fullWidth>
          <AppButton
            size="xs"
            variant="outline"
            disabled={Boolean(revealDisabledReason)}
            title={revealDisabledReason}
            onClick={handleReveal}
          >
            <KeyRound aria-hidden="true" />
            Ver credenciales
          </AppButton>

          <AppButton
            size="xs"
            variant="outline"
            disabled={Boolean(retryDisabledReason)}
            title={retryDisabledReason}
            onClick={handleRetry}
          >
            <RefreshCcw aria-hidden="true" />
            Reintentar prealta
          </AppButton>
        </AppInline>
      </AppStack>
    </article>
  );
});


const TechnicalMetric = memo(function TechnicalMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-md bg-muted/40 px-2.5 py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-xs font-medium text-foreground" title={value}>
        {value}
      </div>
    </div>
  );
});

function formatMetric(value: number | null, suffix?: string) {
  if (!Number.isFinite(value)) return "Pendiente";
  return suffix ? `${value} ${suffix}` : String(value);
}
