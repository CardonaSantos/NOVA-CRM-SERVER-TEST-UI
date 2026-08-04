import { useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppConfirmHandler } from "@/components/app/handlers";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

import { useGetDetalleInstalacionTecnica } from "../CrmHooks/hooks/instalaciones/instalaciones-hook";

import { InstalacionDetalleSkeleton } from "./components/instalacion-detalle-skeleton";

import {
  normalizeDetalleInstalacionTecnicaResponse,
  type InstalacionDetalleActionRequest,
} from "./tecnico-instalacion-detalle.utils";
import { TecnicoInstalacionDetalleView } from "./TecnicoInstalacionDetalleView ";
import { TecnicoInstalacionActionHost } from "./TecnicoInstalacionActionHost";

export default function TecnicoInstalacionDetallePage() {
  const navigate = useNavigate();

  const { instalacionId: instalacionIdParam } = useParams<{
    instalacionId: string;
  }>();

  const instalacionId = Number(instalacionIdParam);

  const validId = Number.isInteger(instalacionId) && instalacionId > 0;

  const detalleQuery = useGetDetalleInstalacionTecnica(instalacionId);

  const detalle = useMemo(() => {
    if (!detalleQuery.data) return null;

    return normalizeDetalleInstalacionTecnicaResponse(detalleQuery.data);
  }, [detalleQuery.data]);

  /**
   * Conserva coordinados:
   * - diálogo abierto
   * - acción solicitada
   * - instalación/acceso involucrado
   */
  const actionFlow = useAppConfirmHandler<InstalacionDetalleActionRequest>();

  const handleBack = useCallback(() => {
    navigate("/crm/instalaciones/tecnico");
  }, [navigate]);

  /**
   * Este es el onAction real que recibe la vista.
   *
   * No ejecuta directamente todas las mutations:
   * selecciona el flujo y abre el dialog correspondiente.
   */
  const handleAction = useCallback(
    (request: InstalacionDetalleActionRequest) => {
      actionFlow.open(request);
    },
    [actionFlow.open],
  );

  /**
   * Se ejecuta después de que una acción termina correctamente.
   */
  const handleActionCompleted = useCallback(async () => {
    actionFlow.setOpen(false);
    await detalleQuery.refetch();
  }, [actionFlow.setOpen, detalleQuery.refetch]);

  if (!validId) {
    return (
      <AppContainer size="md" paddingX="sm" paddingY="sm">
        <AppEmptyState
          preset="empty"
          variant="soft"
          title="Instalación no válida"
          description="No se encontró un identificador válido."
          action={
            <AppButton variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft aria-hidden="true" />
              Volver
            </AppButton>
          }
        />
      </AppContainer>
    );
  }

  if (detalleQuery.isLoading) {
    return (
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <InstalacionDetalleSkeleton />
      </AppContainer>
    );
  }

  if (detalleQuery.error) {
    return (
      <AppContainer size="lg" paddingX="sm" paddingY="sm">
        <AppDataState
          error={detalleQuery.error}
          onRetry={() => detalleQuery.refetch()}
        >
          <div />
        </AppDataState>
      </AppContainer>
    );
  }

  if (!detalle) {
    return (
      <AppContainer size="md" paddingX="sm" paddingY="sm">
        <AppEmptyState
          preset="empty"
          variant="soft"
          title="Instalación no encontrada"
          description="El detalle no está disponible."
          action={
            <AppButton variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft aria-hidden="true" />
              Volver
            </AppButton>
          }
        />
      </AppContainer>
    );
  }

  return (
    <>
      <AppDataState isFetching={detalleQuery.isFetching}>
        <TecnicoInstalacionDetalleView
          detalle={detalle}
          onBack={handleBack}
          onAction={handleAction}
        />
      </AppDataState>

      <TecnicoInstalacionActionHost
        request={actionFlow.target}
        open={actionFlow.isOpen}
        onOpenChange={actionFlow.setOpen}
        onCompleted={handleActionCompleted}
      />
    </>
  );
}
