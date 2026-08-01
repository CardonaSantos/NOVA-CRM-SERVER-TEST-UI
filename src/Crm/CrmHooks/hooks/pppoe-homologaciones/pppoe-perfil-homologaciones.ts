import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";

import type {
  ActualizarCodigoPerfilPayload,
  CambiarEstadoPerfilPayload,
  CrearPerfilHomologacionPayload,
  ListarPerfilesHomologacionParams,
  PerfilHomologacionPage,
  PerfilHomologacionResponse,
} from "@/Crm/features/pppoe-homologaciones/pppoe-homologaciones.types";

import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { pppoe_homologacionesQk } from "./Qk";

export function usePerfilesHomologacion(
  params: ListarPerfilesHomologacionParams,
  enabled = true,
) {
  return useCrmQuery<PerfilHomologacionPage>(
    pppoe_homologacionesQk.search(params),
    crm_endpoints.pppoe.ppoe_perfil_homologacion,
    { params },
    {
      enabled,
      placeholderData: (previousData) => previousData,
    },
  );
}

function useInvalidatePerfilesHomologacion() {
  const invalidateQk = useInvalidateQk();

  return () => {
    invalidateQk(pppoe_homologacionesQk.all);
  };
}

export function useCrearPerfilHomologacion() {
  const invalidate = useInvalidatePerfilesHomologacion();

  return useCrmMutation<
    PerfilHomologacionResponse,
    CrearPerfilHomologacionPayload
  >("post", crm_endpoints.pppoe.ppoe_perfil_homologacion, undefined, {
    onSuccess: invalidate,
  });
}

export function useActualizarCodigoPerfil(id: number | null) {
  const invalidate = useInvalidatePerfilesHomologacion();

  return useCrmMutation<
    PerfilHomologacionResponse,
    ActualizarCodigoPerfilPayload
  >(
    "patch",
    crm_endpoints.pppoe.ppoe_perfil_homologacion_actualizar_codigo(id ?? 0),
    undefined,
    {
      onSuccess: invalidate,
    },
  );
}

export function useCambiarEstadoPerfil(
  id: number | null,
  action: "activar" | "desactivar",
) {
  const invalidate = useInvalidatePerfilesHomologacion();

  return useCrmMutation<PerfilHomologacionResponse, CambiarEstadoPerfilPayload>(
    "patch",
    crm_endpoints.pppoe.ppoe_perfil_homologacion_actualizar_estado(
      id ?? 0,
      action,
    ),
    undefined,
    {
      onSuccess: invalidate,
    },
  );
}
