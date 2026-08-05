import { ClipboardList, History, Router } from "lucide-react";
import { Link } from "react-router-dom";

import { useAppStateHandlers } from "@/components/app/handlers";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTabs } from "@/components/app/primitives/app-tabs";

import {
  getClienteNombre,
  getEstadoToneInstalacion,
  humanizeEnum,
} from "./instalacion-utils.utils";
import {
  InstalacionDetailTab,
  InstalacionDetailViewProps,
} from "../instalacion-detail.types";
import { InstalacionGeneralTab } from "../tabs/instalacion-general-tab";
import { InstalacionPppoeAuditoriaTab } from "../tabs/instalacion-pppoe-auditoria-tab";
import { InstalacionPppoeAdministracionTab } from "../tabs/instalacion-pppoe-administracion-tab";

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

export function InstalacionDetailView(props: InstalacionDetailViewProps) {
  const { instalacion } = props;
  const clienteNombre = getClienteNombre(instalacion);

  const tabs = useAppStateHandlers<{
    activeTab: InstalacionDetailTab;
  }>({
    activeTab: "detalle",
  });

  const activeTab = tabs.state.activeTab;

  return (
    <AppStack gap="md">
      <AppInline
        justify="between"
        align="start"
        collapseBelow="sm"
        gap="sm"
        fullWidth
      >
        <div className="min-w-0">
          <AppInline align="center" gap="xs" wrap>
            <h1 className="text-base font-semibold">
              Instalación #{instalacion.id}
            </h1>

            <AppBadge
              tone={getEstadoToneInstalacion(instalacion.estado)}
              appearance="soft"
              size="xs"
              radius="full"
            >
              {humanizeEnum(instalacion.estado)}
            </AppBadge>

            <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
              {humanizeEnum(instalacion.tipo)}
            </AppBadge>
          </AppInline>

          <p className={`truncate text-sm ${mutedTextClass}`}>
            {clienteNombre}
          </p>
        </div>

        <AppButton asChild variant="outline" size="sm">
          <Link to={`/crm/cliente/${instalacion.cliente.id}/?tab=resumen`}>
            Ver cliente
          </Link>
        </AppButton>
      </AppInline>

      <AppTabs
        value={activeTab}
        onValueChange={(value) =>
          tabs.setField("activeTab", value as InstalacionDetailTab)
        }
        variant="minimal"
        size="sm"
        contentSpacing="sm"
        tabs={[
          {
            value: "detalle",
            label: "Detalle de instalación",
            icon: <ClipboardList aria-hidden="true" />,
            content: <InstalacionGeneralTab {...props} />,
          },
          {
            value: "auditoria",
            label: "Auditoría",
            icon: <History aria-hidden="true" />,
            content: (
              <InstalacionPppoeAuditoriaTab
                instalacionId={instalacion.id}
                enabled={activeTab === "auditoria"}
              />
            ),
          },
          {
            value: "pppoe",
            label: "Administración PPPoE",
            icon: <Router aria-hidden="true" />,
            content: (
              <InstalacionPppoeAdministracionTab
                instalacion={instalacion}
                enabled={activeTab === "pppoe"}
              />
            ),
          },
        ]}
      />
    </AppStack>
  );
}
