import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import type { FiltrarClienteDesinstalacionesParams } from "@/Crm/features/desinstalaciones/filter";

import type { ClienteDesinstalacionListResponse } from "@/Crm/features/desinstalaciones/desinstalaciones.interfaces";

import { desinstalacionesQkeys } from "./qk";
import { ClienteDesinstalacionDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { SubirEvidenciaDesinstalacionResponse } from "@/Crm/features/desinstalaciones/desinstalaciones-evidencia-response";

export function useGetDesinstalacionesPaginated(
  query: FiltrarClienteDesinstalacionesParams,
) {
  const empresaIdValida =
    Number.isInteger(query.empresaId) && query.empresaId > 0;
  return crm.useQueryApi<ClienteDesinstalacionListResponse>(
    desinstalacionesQkeys.list(query),

    crm_endpoints.desinstalaciones.get_desinstalaciones_paginated,
    {
      params: query,
    },
    {
      enabled: empresaIdValida,
    },
  );
}

export function useGetDesinstalacionDetalle(desinstalacionId: number) {
  const idValido = Number.isInteger(desinstalacionId) && desinstalacionId > 0;

  return crm.useQueryApi<ClienteDesinstalacionDetalle>(
    desinstalacionesQkeys.specific(desinstalacionId),

    crm_endpoints.desinstalaciones.get_desinstalacion(desinstalacionId),

    {},

    {
      enabled: idValido,
    },
  );
}

/**
 * Carga una evidencia para una desinstalación.
 *
 * El endpoint recibe un archivo por petición.
 * El manejo de múltiples evidencias se realiza
 * secuencialmente desde la UI.
 */
export function usePostEvidenciaDesinstalacion(desinstalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<SubirEvidenciaDesinstalacionResponse, FormData>(
    "post",

    crm_endpoints.desinstalaciones.post_evidencias(desinstalacionId),

    undefined,

    {
      onSuccess: () => {
        invalidate(desinstalacionesQkeys.all);
      },
    },
  );
}
