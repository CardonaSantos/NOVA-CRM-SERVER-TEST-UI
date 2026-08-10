import type { FiltrarClienteDesinstalacionesParams } from "@/Crm/features/desinstalaciones/filter";

export const desinstalacionesQkeys = {
  all: ["desinstalaciones"] as const,

  lists: () => [...desinstalacionesQkeys.all, "list"] as const,

  list: (query: FiltrarClienteDesinstalacionesParams) =>
    [...desinstalacionesQkeys.lists(), query] as const,

  details: () => [...desinstalacionesQkeys.all, "detail"] as const,

  specific: (desinstalacionId: number) =>
    [...desinstalacionesQkeys.details(), desinstalacionId] as const,
};
