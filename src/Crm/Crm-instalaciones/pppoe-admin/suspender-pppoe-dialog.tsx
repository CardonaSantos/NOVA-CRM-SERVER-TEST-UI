import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { AppForm, AppFormSubmit, AppFormTextarea } from "@/components/app/form";
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
import { usePostSuspenderCuentaPppoe } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";
import {
  motivoSuspensionPppoeSchema,
  type MotivoSuspensionPppoeFormValues,
} from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.schemas";
import { createPppoeManualIdempotencyKey } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.utils";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { PppoeAdminDialogProps } from "./pppoe-admin-dialog.types";

type Props = PppoeAdminDialogProps & {
  cuentaPppoeId: number;
};

const DEFAULTS: MotivoSuspensionPppoeFormValues = {
  motivo: "",
};

export function SuspenderPppoeDialog({
  cuentaPppoeId,
  open,
  onOpenChange,
  onCompleted,
}: Props) {
  const mutation = usePostSuspenderCuentaPppoe(cuentaPppoeId);
  const idempotencyKeyRef = useRef("");
  const form = useForm<MotivoSuspensionPppoeFormValues>({
    resolver: zodResolver(motivoSuspensionPppoeSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) return;

    idempotencyKeyRef.current = createPppoeManualIdempotencyKey(
      "suspender",
      cuentaPppoeId,
    );
    form.reset(DEFAULTS);
  }, [cuentaPppoeId, form, open]);

  const onSubmit: SubmitHandler<MotivoSuspensionPppoeFormValues> = async (
    values,
  ) => {
    try {
      await toast.promise(
        mutation.mutateAsync({
          claveIdempotencia: idempotencyKeyRef.current,
          motivo: values.motivo.trim(),
        }),
        {
          loading: "Suspendiendo servicio PPPoE...",
          success: "Servicio PPPoE suspendido",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      onCompleted();
    } catch {
      // El backend conserva autoridad sobre estado, permisos y concurrencia.
    }
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent size="sm">
        <AppDialogHeader>
          <AppDialogTitle>Suspender servicio PPPoE</AppDialogTitle>
          <AppDialogDescription>
            Se deshabilitará el secret y se eliminarán las sesiones activas.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppAlert
                tone="danger"
                title="Interrupción del servicio"
                size="xs"
              >
                Esta acción desconectará al cliente. No cambia automáticamente
                su estado comercial ni el estado de la instalación.
              </AppAlert>

              <AppFormTextarea<MotivoSuspensionPppoeFormValues>
                name="motivo"
                label="Motivo de suspensión"
                placeholder="Explique por qué se suspende el acceso"
                rows={4}
                resizeMode="vertical"
                required
              />

              <AppInline justify="end" gap="xs" fullWidth>
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={mutation.isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Volver
                </AppButton>

                <AppFormSubmit<MotivoSuspensionPppoeFormValues>
                  variant="danger"
                  size="sm"
                  loadingText="Suspendiendo..."
                  disableWhenInvalid
                >
                  Confirmar suspensión
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
