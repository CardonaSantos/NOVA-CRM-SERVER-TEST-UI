import { memo } from "react";

import { ArrowLeft } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppStack } from "@/components/app/primitives/app-stack";

import type { ClienteDesinstalacionDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";

import {
  AutorizacionCard,
  ClienteServicioCard,
  CostosDesinstalacionCard,
  ParticipantesCard,
  ResumenOperativoCard,
} from "./components/desinstalacion-overview-cards";

import { DesinstalacionAccesoPppoeCard } from "./components/desinstalacion-pppoe-card";

import { DesinstalacionTrabajoCard } from "./components/desinstalacion-trabajo-card";

import { DesinstalacionEvidenciasCard } from "./components/desinstalacion-evidencias-card";
import { DesinstalacionEvidenciasUpload } from "./evidencia/desinstalacion-evidencias-upload";

type DesinstalacionDetalleViewProps = {
  detalle: ClienteDesinstalacionDetalle;

  onBack: () => void;

  onUploadEvidence?: () => void;
};

export const DesinstalacionDetalleView = memo(
  function DesinstalacionDetalleView({
    detalle,

    onBack,

    onUploadEvidence,
  }: DesinstalacionDetalleViewProps) {
    const clienteNombre = [detalle.cliente.nombre, detalle.cliente.apellidos]
      .filter(Boolean)
      .join(" ");

    return (
      <AppStack gap="sm">
        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <AppStack gap="sm">
            <ResumenOperativoCard detalle={detalle} />

            <ClienteServicioCard detalle={detalle} />

            <DesinstalacionAccesoPppoeCard detalle={detalle} />

            <DesinstalacionTrabajoCard detalle={detalle} />
          </AppStack>

          <AppStack gap="sm">
            <AutorizacionCard detalle={detalle} />

            <CostosDesinstalacionCard detalle={detalle} />

            <ParticipantesCard detalle={detalle} />
          </AppStack>
        </div>

        {/* ANCHO COMPLETO */}
        <DesinstalacionEvidenciasUpload desinstalacionId={detalle.id} />

        <DesinstalacionEvidenciasCard
          evidencias={detalle.evidencias}
          onUploadEvidence={onUploadEvidence}
        />
      </AppStack>
    );
  },
);
