import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { usePostIniciarInstalacionTecnica } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
import {
  AppForm,
  AppFormInput,
  AppFormSubmit,
  AppFormSwitch,
} from "@/components/app/form";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { InstalacionActionDialogProps } from "./action-dialog.types";
import {
  iniciarInstalacionSchema,
  type IniciarInstalacionFormValues,
} from "./instalacion-action.schemas";

const DEFAULTS: IniciarInstalacionFormValues = {
  contrasenaActual: "",
  activarServicio: true,
};

export function IniciarInstalacionDialog({
  instalacionId,
  open,
  onOpenChange,
  onCompleted,
}: InstalacionActionDialogProps) {
  const mutation = usePostIniciarInstalacionTecnica(instalacionId);
  const form = useForm<IniciarInstalacionFormValues>({
    resolver: zodResolver(iniciarInstalacionSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) form.reset(DEFAULTS);
  }, [form, open]);

  const onSubmit: SubmitHandler<IniciarInstalacionFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          contrasenaActual: values.contrasenaActual,
          activarServicio: values.activarServicio,
        }),
        {
          loading: "Iniciando instalación...",
          success: "Instalación iniciada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      form.reset(DEFAULTS);
      await onCompleted();
    } catch {
      // No limpiar la contraseña si el servidor rechaza la acción.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Iniciar instalación</AppDialogTitle>
          <AppDialogDescription>
            Confirma tu identidad antes de ejecutar el flujo técnico.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert tone="info" size="xs" variant="soft">
                El sistema creará o confirmará el secret PPPoE asociado.
              </AppAlert>

              <AppFormInput<IniciarInstalacionFormValues>
                name="contrasenaActual"
                type="password"
                label="Contraseña actual"
                autoComplete="current-password"
                required
              />

              <AppFormSwitch<IniciarInstalacionFormValues>
                name="activarServicio"
                fieldLabel="Servicio"
                label="Activar al iniciar"
                description="Mantén esta opción activa para el flujo normal."
              />

              <AppInline justify="end" gap="xs" fullWidth>
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={mutation.isPending}
                  onClick={() => handleOpenChange(false)}
                >
                  Cerrar
                </AppButton>

                <AppFormSubmit<IniciarInstalacionFormValues>
                  size="sm"
                  loadingText="Iniciando..."
                  disableWhenInvalid
                >
                  Iniciar
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
