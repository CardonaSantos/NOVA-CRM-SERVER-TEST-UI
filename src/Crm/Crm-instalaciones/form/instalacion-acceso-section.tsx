import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { AppFormSingleSelect } from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import {
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
} from "@/Crm/features/instalaciones/enums";
import { CrearInstalacionFormValues } from "../schema/zod.schema";

type InstalacionAccesoSectionProps = {
  tecnologiaOptions: AppSelectOption<TecnologiaAccesoInternet>[];
  metodoAutenticacionOptions: AppSelectOption<MetodoAutenticacionInternet>[];
  routerOptions: AppSelectOption<number>[];
  isLoadingRouters?: boolean;
};

export function InstalacionAccesoSection({
  tecnologiaOptions,
  metodoAutenticacionOptions,
  routerOptions,
  isLoadingRouters = false,
}: InstalacionAccesoSectionProps) {
  const form = useFormContext<CrearInstalacionFormValues>();
  const tecnologia = useWatch({
    control: form.control,
    name: "acceso.tecnologia",
  });
  const metodoAutenticacion = useWatch({
    control: form.control,
    name: "acceso.metodoAutenticacion",
  });

  const requiereRouter =
    tecnologia === TecnologiaAccesoInternet.FIBRA_GPON &&
    metodoAutenticacion === MetodoAutenticacionInternet.PPPOE;

  useEffect(() => {
    if (!requiereRouter) {
      form.setValue("acceso.mikrotikRouterId", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form, requiereRouter]);

  return (
    <section aria-labelledby="instalacion-acceso-title">
      <AppStack gap="sm">
        <div>
          <h2 id="instalacion-acceso-title" className="text-base font-medium">
            Acceso de internet
          </h2>
          <p className="text-sm text-muted-foreground">
            Define la tecnología y el método de autenticación que usará el
            cliente.
          </p>
        </div>

        <AppGrid cols={{ base: 1, md: 2, xl: 3 }} gap="sm">
          <AppFormSingleSelect<
            CrearInstalacionFormValues,
            TecnologiaAccesoInternet
          >
            name="acceso.tecnologia"
            label="Tecnología"
            options={tecnologiaOptions}
            placeholder="Seleccione la tecnología"
            density="compact"
            required
          />

          <AppFormSingleSelect<
            CrearInstalacionFormValues,
            MetodoAutenticacionInternet
          >
            name="acceso.metodoAutenticacion"
            label="Método de autenticación"
            options={metodoAutenticacionOptions}
            placeholder="Seleccione el método"
            density="compact"
            required
          />

          {requiereRouter ? (
            <AppFormSingleSelect<CrearInstalacionFormValues, number>
              name="acceso.mikrotikRouterId"
              label="Router MikroTik"
              options={routerOptions}
              placeholder="Seleccione el router"
              density="compact"
              isSearchable
              isLoading={isLoadingRouters}
              required
            />
          ) : null}
        </AppGrid>
      </AppStack>
    </section>
  );
}
