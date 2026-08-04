import { memo } from "react";

import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";

import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";

import { AccesosPppoeCard } from "./components/accesos-pppoe-card";
import { AuditoriaCard } from "./components/auditoria-card";
import { ClienteUbicacionCard } from "./components/cliente-ubicacion-card";
import { CostosInstalacionCard } from "./components/costos-instalacion-card";
import { EquiposCard } from "./components/equipos-card";
import { EvidenciasCard } from "./components/evidencias-card";
import { InstalacionDetalleHeader } from "./components/instalacion-detalle-header";
import { InstalacionWorkflowCard } from "./components/instalacion-workflow-card";
import { ParticipantesCard } from "./components/participantes-card";
import { ResumenOperativoCard } from "./components/resumen-operativo-card";
import { TrabajoCard } from "./components/trabajo-card";

import type { InstalacionDetalleActionRequest } from "./tecnico-instalacion-detalle.utils";

type TecnicoInstalacionDetalleViewProps = {
  detalle: DetalleInstalacionTecnicaResponse;
  onBack: () => void;
  onAction: (request: InstalacionDetalleActionRequest) => void;
};

export const TecnicoInstalacionDetalleView = memo(
  function TecnicoInstalacionDetalleView({
    detalle,
    onBack,
    onAction,
  }: TecnicoInstalacionDetalleViewProps) {
    return (
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <article aria-labelledby="instalacion-detalle-title">
          <AppStack gap="sm">
            <InstalacionDetalleHeader detalle={detalle} onBack={onBack} />

            <InstalacionWorkflowCard detalle={detalle} onAction={onAction} />

            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <AppStack gap="sm">
                <ResumenOperativoCard detalle={detalle} />

                <ClienteUbicacionCard
                  cliente={detalle.cliente}
                  ubicacion={detalle.ubicacion}
                />

                <AccesosPppoeCard detalle={detalle} onAction={onAction} />

                <TrabajoCard trabajo={detalle.trabajo} />

                <EvidenciasCard evidencias={detalle.evidencias} />
              </AppStack>

              <AppStack gap="sm">
                <CostosInstalacionCard detalle={detalle} />

                <ParticipantesCard participantes={detalle.participantes} />

                <EquiposCard equipos={detalle.equipos} />

                <AuditoriaCard />
              </AppStack>
            </div>
          </AppStack>
        </article>
      </AppContainer>
    );
  },
);
