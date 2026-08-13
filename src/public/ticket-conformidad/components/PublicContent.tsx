import { AppStack } from "@/components/app/primitives/app-stack";
import { useTicketConformidadCountdown } from "../hooks/tickets-conformidad/use-ticket-conformidad-countdown";
import { TicketConformidadPublicStep } from "../types/conformidad-types.public";
import { TicketConformidadPublicShell } from "./TicketConformidadPublicShell";
import { AppCard } from "@/components/app/primitives/app-card";
import { TicketConformidadCountdown } from "./TicketConformidadCountdown";
import { TicketConformidadDecision } from "./TicketConformidadDecision";
import { useState } from "react";
import { TicketConformidadBackButton } from "./TicketConformidadBackButton";
import { RegistrarFirmaTicketConformidadResponse } from "../types/ticket-conformidad-public.types";
import { TicketConformidadFirmaForm } from "../form/TicketConformidadFirmaForm";
import { TicketConformidadSuccess } from "./TicketConformidadSuccess";

interface PublicContentProps {
  token: string;
  data: {
    ticket: {
      id: number;
      titulo: string | null;
      descripcion: string | null;
    };

    cliente: {
      nombreCompleto: string;
      telefono: string | null;
    } | null;

    conformidad: {
      expiraEn: string;
    };
  };

  step: TicketConformidadPublicStep;

  onStepChange: (step: TicketConformidadPublicStep) => void;
}

export function PublicContent({
  data,
  step,
  onStepChange,
  token,
}: PublicContentProps) {
  const [firmaResponse, setFirmaResponse] =
    useState<RegistrarFirmaTicketConformidadResponse | null>(null);

  const countdown = useTicketConformidadCountdown(data.conformidad.expiraEn);

  const canRespond = countdown.validDate && !countdown.expired;

  const handleBackToDecision = () => {
    onStepChange(TicketConformidadPublicStep.DECISION);
  };

  const handleFirmaCompleted = (
    response: RegistrarFirmaTicketConformidadResponse,
  ) => {
    setFirmaResponse(response);

    onStepChange(TicketConformidadPublicStep.FINAL_CONFORME);
  };
  const isFinalStep =
    step === TicketConformidadPublicStep.FINAL_CONFORME ||
    step === TicketConformidadPublicStep.FINAL_RETRABAJO;

  return (
    <TicketConformidadPublicShell>
      <AppStack gap="md">
        {/* TU HEADER ACTUAL */}

        {/* TU CARD DE TICKET ACTUAL */}

        {!isFinalStep && (
          <TicketConformidadCountdown expiraEn={data.conformidad.expiraEn} />
        )}
        {canRespond && step === TicketConformidadPublicStep.DECISION && (
          <TicketConformidadDecision
            onConforme={() => onStepChange(TicketConformidadPublicStep.FIRMA)}
            onNoConforme={() =>
              onStepChange(TicketConformidadPublicStep.CONFIRMAR_RETRABAJO)
            }
          />
        )}

        {canRespond && step === TicketConformidadPublicStep.FIRMA && (
          <TicketConformidadFirmaForm
            token={token}
            nombreInicial={data.cliente?.nombreCompleto}
            telefonoInicial={data.cliente?.telefono}
            onBack={handleBackToDecision}
            onCompleted={handleFirmaCompleted}
          />
        )}

        {canRespond &&
          step === TicketConformidadPublicStep.CONFIRMAR_RETRABAJO && (
            <AppCard>
              <AppStack gap="md">
                <TicketConformidadBackButton onClick={handleBackToDecision} />

                <div>
                  <h2 className="text-base font-semibold sm:text-lg">
                    Confirmar inconformidad
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Confirme si el trabajo realizado necesita una corrección.
                  </p>
                </div>

                {/* Aquí conectamos /retrabajo después */}
              </AppStack>
            </AppCard>
          )}

        {step === TicketConformidadPublicStep.FINAL_CONFORME &&
          firmaResponse && (
            <TicketConformidadSuccess ticketId={data.ticket.id} />
          )}
      </AppStack>
    </TicketConformidadPublicShell>
  );
}
