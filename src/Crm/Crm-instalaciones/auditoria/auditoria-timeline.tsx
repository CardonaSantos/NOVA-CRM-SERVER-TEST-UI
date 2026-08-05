import { AppStack } from "@/components/app/primitives/app-stack";

import type { InstalacionPppoeTimelineItem } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

import { AuditoriaIndependienteCard } from "./auditoria-independiente-card";
import { AuditoriaOperacionCard } from "./auditoria-operacion-card";

type Props = {
  items: InstalacionPppoeTimelineItem[];
};

export function AuditoriaTimeline({ items }: Props) {
  return (
    <AppStack gap="sm">
      {items.map((item) =>
        item.tipoRegistro === "OPERACION" ? (
          <AuditoriaOperacionCard
            key={`operacion-${item.operacion.id}`}
            item={item}
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
