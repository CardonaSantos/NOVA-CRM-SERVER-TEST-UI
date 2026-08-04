import { memo } from "react";
import {
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  UserRound,
} from "lucide-react";
import type { DetalleInstalacionTecnicaResponse } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { getCoordinatesUrl } from "../tecnico-instalacion-detalle.utils";
import { DetailValueRow } from "./detail-value-row";
import { DetalleSectionCard } from "./detalle-section-card";

type ClienteUbicacionCardProps = {
  cliente: DetalleInstalacionTecnicaResponse["cliente"];
  ubicacion: DetalleInstalacionTecnicaResponse["ubicacion"];
};

export const ClienteUbicacionCard = memo(function ClienteUbicacionCard({
  cliente,
  ubicacion,
}: ClienteUbicacionCardProps) {
  const mapsUrl = getCoordinatesUrl(ubicacion.latitud, ubicacion.longitud);
  const address = ubicacion.direccion ?? cliente.direccion ?? "Sin dirección";

  return (
    <DetalleSectionCard id="cliente-ubicacion" title="Cliente y ubicación" icon={UserRound}>
      <AppStack gap="sm">
        <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
          <DetailValueRow
            icon={UserRound}
            label="Cliente"
            value={cliente.nombreCompleto}
            emphasize
          />
          <DetailValueRow icon={MapPin} label="Dirección" value={address} />
          {ubicacion.referencia ? (
            <DetailValueRow
              icon={Navigation}
              label="Referencia"
              value={ubicacion.referencia}
            />
          ) : null}
          {cliente.telefono ? (
            <DetailValueRow
              icon={Phone}
              label="Teléfono"
              value={cliente.telefono}
            />
          ) : null}
        </AppGrid>

        {cliente.telefono || mapsUrl ? (
          <AppInline gap="xs" wrap fullWidth>
            {cliente.telefono ? (
              <AppButton asChild size="xs" variant="outline">
                <a href={`tel:${cliente.telefono}`}>
                  <Phone aria-hidden="true" />
                  Llamar
                </a>
              </AppButton>
            ) : null}

            {mapsUrl ? (
              <AppButton asChild size="xs" variant="outline">
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <ExternalLink aria-hidden="true" />
                  Abrir mapa
                </a>
              </AppButton>
            ) : null}
          </AppInline>
        ) : null}
      </AppStack>
    </DetalleSectionCard>
  );
});
