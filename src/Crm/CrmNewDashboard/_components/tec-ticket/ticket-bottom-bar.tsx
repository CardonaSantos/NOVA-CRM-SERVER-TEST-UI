import { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import { getBlockedActionLabel } from "../ticket-helpers";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppStack } from "@/components/app/primitives/app-stack";

import { CheckCircle2, Link2, PenLine, Send, Wrench } from "lucide-react";

import { TicketLifecycleAction } from "./ticket-details";
import { useNavigate } from "react-router-dom";

interface TicketBottomActionBarProps {
  ticket: TicketAsignadoTecnico;

  lifecycleAction: TicketLifecycleAction | null;

  isLoading: boolean;

  conformidadLoading?: boolean;

  onRequestAction: () => void;

  onRequestConformidad: () => void;
}

export function TicketBottomActionBar({
  ticket,
  lifecycleAction,
  isLoading,
  conformidadLoading = false,
  onRequestAction,
  onRequestConformidad,
}: TicketBottomActionBarProps) {
  const navigate = useNavigate();

  const disabledLabel = getBlockedActionLabel(ticket.estado);

  const busy = isLoading || conformidadLoading;

  const handleFirmaTecnico = () => {
    navigate(`/crm/ticket-detalles/${ticket.id}/firma-tecnico`);
  };

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-40",
        "border-t border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-background,var(--background))/0.88)]",
        "px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2",
        "backdrop-blur-md",
        "md:sticky md:bottom-3 md:rounded-[var(--app-radius-lg)] md:border md:px-3 md:py-3",
      ].join(" ")}
    >
      <AppStack gap="xs">
        <AppButton
          type="button"
          size="lg"
          variant="outline"
          width="full"
          leftIcon={<PenLine className="h-5 w-5" aria-hidden="true" />}
          onClick={handleFirmaTecnico}
        >
          Firmar como técnico
        </AppButton>

        <AppButton
          type="button"
          size="lg"
          variant="outline"
          width="full"
          loading={conformidadLoading}
          loadingText="Generando enlace..."
          disabled={conformidadLoading}
          leftIcon={<Link2 className="h-5 w-5" />}
          onClick={onRequestConformidad}
        >
          Generar enlace de conformidad
        </AppButton>

        {lifecycleAction ? (
          <AppButton
            type="button"
            size="lg"
            variant={lifecycleAction === "review" ? "secondary" : "primary"}
            width="full"
            loading={isLoading}
            loadingText="Procesando..."
            disabled={busy}
            leftIcon={
              lifecycleAction === "review" ? (
                <Send className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Wrench className="h-5 w-5" aria-hidden="true" />
              )
            }
            onClick={onRequestAction}
          >
            {lifecycleAction === "review"
              ? "Enviar a revisión"
              : "Tomar ticket en proceso"}
          </AppButton>
        ) : (
          <AppButton
            type="button"
            size="lg"
            variant="secondary"
            width="full"
            disabled
            leftIcon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          >
            {disabledLabel}
          </AppButton>
        )}
      </AppStack>
    </div>
  );
}
