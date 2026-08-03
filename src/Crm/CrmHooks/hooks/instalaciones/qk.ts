import { FiltrarClienteInstalacionesParams } from "@/Crm/features/instalaciones/filter";

export const instalacionesQkeys = {
  all: ["instalaciones"] as const,

  lists: () => [...instalacionesQkeys.all, "list"] as const,

  list: (query: FiltrarClienteInstalacionesParams) =>
    [...instalacionesQkeys.lists(), query] as const,

  specific: (id: number) => [...instalacionesQkeys.all, "detail", id] as const,
};
