import { memo, useCallback } from "react";
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  Play,
} from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  getActionDisabledReason,
  getActionLabel,
  getPrimaryWorkflowAction,
  type InstalacionDetalleActionKey,
  type InstalacionDetalleActionRequest,
} from "../tecnico-instalacion-detalle.utils";
import { DetalleSectionCard } from "./detalle-section-card";

type InstalacionWorkflowCardProps = {
  detalle: DetalleInstalacionTecnicaResponse;
  onAction?: (request: InstalacionDetalleActionRequest) => void;
};

const SECONDARY_ACTIONS: readonly InstalacionDetalleActionKey[] = [];

export const InstalacionWorkflowCard = memo(function InstalacionWorkflowCard({
  detalle,
  onAction,
}: InstalacionWorkflowCardProps) {
  const primaryAction = getPrimaryWorkflowAction(detalle);

  const handleAction = useCallback(
    (action: InstalacionDetalleActionKey) => {
      onAction?.({ action, instalacionId: detalle.id });
    },
    [detalle.id, onAction],
  );

  return (
    <DetalleSectionCard
      id="flujo-instalacion"
      title="Flujo de instalación"
      icon={ClipboardList}
    >
      <AppStack gap="sm">
        {primaryAction ? (
          <WorkflowButton
            action={primaryAction}
            detalle={detalle}
            hasHandler={Boolean(onAction)}
            primary
            onAction={handleAction}
          />
        ) : (
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            No hay una acción principal disponible.
          </div>
        )}

        <AppInline gap="xs" wrap fullWidth>
          {SECONDARY_ACTIONS.map((action) => (
            <WorkflowButton
              key={action}
              action={action}
              detalle={detalle}
              hasHandler={Boolean(onAction)}
              onAction={handleAction}
            />
          ))}
        </AppInline>
      </AppStack>
    </DetalleSectionCard>
  );
});

type WorkflowButtonProps = {
  action: InstalacionDetalleActionKey;
  detalle: DetalleInstalacionTecnicaResponse;
  hasHandler: boolean;
  primary?: boolean;
  onAction: (action: InstalacionDetalleActionKey) => void;
};

const WorkflowButton = memo(function WorkflowButton({
  action,
  detalle,
  hasHandler,
  primary = false,
  onAction,
}: WorkflowButtonProps) {
  const disabledReason = getActionDisabledReason(detalle, action, hasHandler);
  const Icon = getActionIcon(action);

  return (
    <AppButton
      size={primary ? "sm" : "xs"}
      variant={
        primary ? "primary" : action === "cancelar" ? "danger" : "outline"
      }
      disabled={Boolean(disabledReason)}
      title={disabledReason}
      aria-label={getActionLabel(action)}
      onClick={() => onAction(action)}
    >
      <Icon aria-hidden="true" />
      {getActionLabel(action)}
    </AppButton>
  );
});

function getActionIcon(action: InstalacionDetalleActionKey) {
  switch (action) {
    case "iniciar":
      return Play;
    case "completar":
      return CheckCircle2;
    case "reprogramar":
      return CalendarClock;
    case "subirEvidencia":
      return ImagePlus;
    case "cancelar":
      return Ban;
    default:
      return ClipboardList;
  }
}
