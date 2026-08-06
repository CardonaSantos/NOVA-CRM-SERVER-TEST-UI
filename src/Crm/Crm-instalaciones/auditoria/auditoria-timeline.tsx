import { useMemo } from "react";

import { AppStack } from "@/components/app/primitives/app-stack";

import type {
  InstalacionPppoeOperacionTimelineItem,
  InstalacionPppoeTimelineItem,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import { AuditoriaIndependienteCard } from "./auditoria-independiente-card";
import { AuditoriaOperacionCard } from "./auditoria-operacion-card";

type Props = {
  items: InstalacionPppoeTimelineItem[];

  onRetrySuccess?: () => void;
};

function isOperationItem(
  item: InstalacionPppoeTimelineItem,
): item is InstalacionPppoeOperacionTimelineItem {
  return item.tipoRegistro === "OPERACION";
}

export function AuditoriaTimeline({ items, onRetrySuccess }: Props) {
  const retryableOperationIds = useMemo(() => {
    const latestByChain = new Map<
      number,
      InstalacionPppoeOperacionTimelineItem
    >();

    for (const item of items) {
      if (!isOperationItem(item)) {
        continue;
      }

      const operation = item.operacion;

      /*
       * Los reintentos conservan la referencia
       * a la operación raíz.
       */
      const chainRootId = operation.reintentoDeId ?? operation.id;

      const current = latestByChain.get(chainRootId);

      const isNewer =
        !current ||
        operation.numeroIntento > current.operacion.numeroIntento ||
        (operation.numeroIntento === current.operacion.numeroIntento &&
          operation.id > current.operacion.id);

      if (isNewer) {
        latestByChain.set(chainRootId, item);
      }
    }

    const result = new Set<number>();

    for (const item of latestByChain.values()) {
      const state = item.operacion.estado;

      if (state === "FALLIDA" || state === "PARCIAL") {
        result.add(item.operacion.id);
      }
    }

    return result;
  }, [items]);

  return (
    <AppStack gap="sm">
      {items.map((item) =>
        item.tipoRegistro === "OPERACION" ? (
          <AuditoriaOperacionCard
            key={`operacion-${item.operacion.id}`}
            item={item}
            canRetry={retryableOperationIds.has(item.operacion.id)}
            onRetrySuccess={onRetrySuccess}
          />
        ) : (
          <AuditoriaIndependienteCard
            key={`auditoria-${item.auditoria.id}`}
            item={item}
          />
        ),
      )}
    </AppStack>
  );
}
