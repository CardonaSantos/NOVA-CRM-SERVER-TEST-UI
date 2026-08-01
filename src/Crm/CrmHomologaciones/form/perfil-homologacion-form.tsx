import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
} from "@/components/app/form";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { CrearPerfilHomologacionFormValues } from "../schema/homologacion.schema";

type Option = { value: number; label: string };

interface PerfilHomologacionFormProps {
  form: UseFormReturn<CrearPerfilHomologacionFormValues>;
  routerOptions: Option[];
  servicioOptions: Option[];
  isLoadingOptions?: boolean;
  onSubmit: SubmitHandler<CrearPerfilHomologacionFormValues>;
}

export function PerfilHomologacionForm({
  form,
  routerOptions,
  servicioOptions,
  isLoadingOptions = false,
  onSubmit,
}: PerfilHomologacionFormProps) {
  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <AppGrid cols={{ base: 1, md: 3 }} gap="sm">
        <AppFormSingleSelect<CrearPerfilHomologacionFormValues, number>
          name="mikrotikRouterId"
          label="Router MikroTik"
          options={routerOptions}
          placeholder="Seleccione un router"
          density="compact"
          isLoading={isLoadingOptions}
          required
        />

        <AppFormSingleSelect<CrearPerfilHomologacionFormValues, number>
          name="servicioInternetId"
          label="Plan de internet"
          options={servicioOptions}
          placeholder="Seleccione un plan"
          density="compact"
          isLoading={isLoadingOptions}
          required
        />

        <AppFormInput<CrearPerfilHomologacionFormValues>
          name="codigoPerfil"
          label="Código del perfil"
          placeholder="Ej. PLAN_20M"
          maxLength={100}
          autoComplete="off"
          required
        />
      </AppGrid>

      <AppInline justify="end" fullWidth className="mt-2">
        <AppFormSubmit<CrearPerfilHomologacionFormValues>
          size="sm"
          disableWhenInvalid
        >
          Registrar homologación
        </AppFormSubmit>
      </AppInline>
    </AppForm>
  );
}
