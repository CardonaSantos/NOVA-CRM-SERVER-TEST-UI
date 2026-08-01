import type { ListarPerfilesHomologacionParams } from "@/Crm/features/pppoe-homologaciones/pppoe-homologaciones.types";

export const pppoe_homologacionesQk = {
  all: ["pppoe-perfil-homologacion"] as const,

  lists: () => [...pppoe_homologacionesQk.all, "list"] as const,

  search: (params: ListarPerfilesHomologacionParams) =>
    [...pppoe_homologacionesQk.lists(), params] as const,

  details: () => [...pppoe_homologacionesQk.all, "detail"] as const,

  specific: (id: number) => [...pppoe_homologacionesQk.details(), id] as const,
};
