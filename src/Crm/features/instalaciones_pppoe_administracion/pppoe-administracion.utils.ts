import type {
  EstadoCuentaPppoe,
  InstalacionPppoeOperacionTimelineItem,
  PppoeAuditoriaAccesoAdministrableResumen,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

export function createPppoeManualIdempotencyKey(
  action: "suspender" | "reactivar",
  cuentaPppoeId: number,
) {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `pppoe-manual:${action}:${cuentaPppoeId}:${uuid}`;
}

export function canActivateInitialPppoe(state: EstadoCuentaPppoe) {
  return [
    "PENDIENTE_CREACION",
    "EN_INSTALACION",
    "PENDIENTE_ACTIVACION",
    "ERROR",
  ].includes(state);
}

export function canSuspendPppoe(state: EstadoCuentaPppoe) {
  return state === "ACTIVA";
}

export function canReactivatePppoe(state: EstadoCuentaPppoe) {
  return state === "SUSPENDIDA";
}

export function findAuthorizablePendingOperation(
  items: Array<
    | InstalacionPppoeOperacionTimelineItem
    | { tipoRegistro: "AUDITORIA" }
  >,
) {
  return items.find(
    (item): item is InstalacionPppoeOperacionTimelineItem =>
      item.tipoRegistro === "OPERACION" &&
      item.operacion.estado === "PENDIENTE" &&
      item.operacion.requiereReautenticacion,
  );
}

export function getPrimaryPppoeAccess(
  accesses: PppoeAuditoriaAccesoAdministrableResumen[],
) {
  return accesses.find((access) => access.cuentaPppoe) ?? accesses[0] ?? null;
}

export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
