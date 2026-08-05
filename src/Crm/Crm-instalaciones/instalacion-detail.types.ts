import type { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";

export type InstalacionDetailViewProps = {
  instalacion: ClienteInstalacionDetalle;
  empresaId: number;
  onOpenEvidence: (index: number) => void;
};

export type InstalacionDetailTab =
  | "detalle"
  | "auditoria"
  | "pppoe";
